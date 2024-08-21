import React, { useState, useEffect } from "react";
import App from "../../../components/Layouts/App";
import Swal from "sweetalert2";
import {
  Button,
  Dropdown,
  Table,
  Badge,
  Modal,
  Pagination,
} from "flowbite-react";
import { FormatDate } from "../../../Utilities/FormatDate";
import { getSags, deleteSag } from "../../../../services/sag.service";
import { SagForm } from "../../../components/Fragments/Services/Dokumen/Sag/SagForm";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { SearchInput } from "../../../components/Elements/SearchInput";

// mendefinisikan komponen utama Sag
export function SagPage() {
  const [sags, setSagsState] = useState([]);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [action, setAction] = useState("add");
  const [Tanggal, setTanggal] = useState("");
  const [NoMemo, setNoMemo] = useState("");
  const [Perihal, setPerihal] = useState("");
  const [Pic, setPic] = useState("");
  const [sag, setSag] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [userRole, setUserRole] = useState("user"); // State untuk menyimpan peran pengguna

  // Function untuk fetch data sag dan update state
  const fetchUserRole = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID is missing. Please login again.');
        return;
      }
      const response = await fetch(`http://localhost:8080/user-role?id=${userId}`);
      const data = await response.json();
  
      if (response.ok) {
        setUserRole(data.role); // Set role pengguna dalam state
      } else {
        console.error(data.error); // Tangani kesalahan
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  useEffect(() => {
    fetchUserRole(); // Ambil peran pengguna saat komponen dimuat

    getSags((data) => {
      setSagsState(data.reverse());
    });
  }, []);

  const handleAdd = () => {
    if (userRole !== "admin") return; // Cek peran pengguna
    setFormModalOpen(true);
    setAction("add");
    setTanggal("");
    setNoMemo("");
    setPerihal("");
    setPic("");
  };

  const handleEdit = (sag) => {
    if (userRole !== "admin") return; // Cek peran pengguna
    setFormModalOpen(true);
    setAction("edit");
    const tanggal = new Date(sag.Tanggal);
    setTanggal(tanggal.toISOString().split("T")[0]);
    setNoMemo(sag.NoMemo);
    setPerihal(sag.Perihal);
    setPic(sag.Pic);
    setSag(sag);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (userRole !== "admin") return; // Cek peran pengguna

    if (action === "add") {
      const newData = {
        tanggal: Tanggal.trim(),
        no_memo: NoMemo.trim(),
        perihal: Perihal.trim(),
        pic: Pic.trim(),
      };

      if (!newData.tanggal || !newData.no_memo || !newData.perihal || !newData.pic) {
        Swal.fire({
          icon: "info",
          title: "Gagal!",
          text: "Mohon untuk mengisi semua kolom",
        });
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/sag", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil ditambahkan",
          showConfirmButton: false,
          timer: 1500,
        });

        setSagsState([...sags, data]);
        onCloseFormModal();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Terjadi kesalahan saat menyimpan data",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else if (action === "edit") {
      const updatedData = {
        id: sag.ID,
        tanggal: Tanggal.trim(),
        no_memo: NoMemo.trim(),
        perihal: Perihal.trim(),
        pic: Pic.trim(),
      };

      try {
        const response = await fetch(`http://localhost:8080/sag/${sag.ID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil diperbarui",
          showConfirmButton: false,
          timer: 1500,
        });

        setSagsState(sags.map((sag) => (sag.ID === data.ID ? data : sag)));
        onCloseFormModal();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal mengubah data",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const handleUpdateThisSheet = async () => {
    if (userRole !== "admin") return; // Cek peran pengguna

    try {
      const response = await fetch("http://localhost:8080/updateSag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedData: sags }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      console.log("Data updated successfully:", data);
      setSagsState(data);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleUpdateAllSheet = () => {
    if (userRole !== "admin") return; // Cek peran pengguna

    fetch("http://localhost:8080/updateAll", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sags),
    });
  };

  const handleExportThisSheet = () => {
    const data = sags.map((sag) => ({
      ID: sag.ID,
      Tanggal: sag.Tanggal,
      NoMemo: sag.NoMemo,
      Perihal: sag.Perihal,
      Pic: sag.Pic,
    }));

    fetch('http://localhost:8080/exportsag')
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'its_report.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error exporting data:', error));

    exportToExcel(data);
  };

  const onCloseFormModal = () => {
    setFormModalOpen(false);
    setTanggal("");
    setNoMemo("");
    setPerihal("");
    setPic("");
  };

  const handleDelete = async (id) => {
    if (userRole !== "admin") return; // Cek peran pengguna

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan menghapus data ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, saya yakin",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSag(id);
          setSagsState(sags.filter((sag) => sag.ID !== id));
          Swal.fire("Berhasil!", "Data berhasil dihapus", "success");
        } catch (error) {
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data", "error");
        }
      }
    });
  };

  // Filter dan paginasi
  const filteredSags = sags.filter((sag) =>
    sag.NoMemo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSags = filteredSags.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <App>
      <div className="container mx-auto p-4">
        {userRole === "admin" && (
          <div className="mb-4 flex justify-between items-center">
            <Button onClick={handleAdd} color="info">Tambah</Button>
            <div>
              <Dropdown color="success" label="Export Excel">
                <Dropdown.Item onClick={handleExportThisSheet}>This Sheet</Dropdown.Item>
                <Dropdown.Item>All Sheet</Dropdown.Item>
              </Dropdown>
              <Dropdown color="success" label="Update Excel">
                <Dropdown.Item onClick={handleUpdateThisSheet}>This Sheet</Dropdown.Item>
                <Dropdown.Item onClick={handleUpdateAllSheet}>All Sheet</Dropdown.Item>
              </Dropdown>
              <Button color="warning">Import Excel</Button>
            </div>
          </div>
        )}

        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <Table>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Tanggal</Table.HeadCell>
            <Table.HeadCell>No Memo</Table.HeadCell>
            <Table.HeadCell>Perihal</Table.HeadCell>
            <Table.HeadCell>Pic</Table.HeadCell>
            {userRole === "admin" && <Table.HeadCell>Aksi</Table.HeadCell>}
          </Table.Head>
          <Table.Body>
            {currentSags.length > 0 ? (
              currentSags.map((sag) => (
                <Table.Row key={sag.ID}>
                  <Table.Cell>{sag.ID}</Table.Cell>
                  <Table.Cell>{FormatDate(sag.Tanggal)}</Table.Cell>
                  <Table.Cell>{sag.NoMemo}</Table.Cell>
                  <Table.Cell>{sag.Perihal}</Table.Cell>
                  <Table.Cell>{sag.Pic}</Table.Cell>
                  {userRole === "admin" && (
                    <Table.Cell>
                      <Button onClick={() => handleEdit(sag)} color="warning">Ubah</Button>
                      <Button onClick={() => handleDelete(sag.ID)} color="failure">Hapus</Button>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={userRole === "admin" ? 7 : 6}>Data tidak ditemukan</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={Math.ceil(filteredSags.length / itemsPerPage)}
          showIcons
        />

        <Modal show={formModalOpen} onClose={onCloseFormModal}>
          <Modal.Header>{action === "add" ? "Tambah Data" : "Ubah Data"}</Modal.Header>
          <Modal.Body>
            <SagForm
              tanggal={Tanggal}
              noMemo={NoMemo}
              perihal={Perihal}
              pic={Pic}
              setTanggal={setTanggal}
              setNoMemo={setNoMemo}
              setPerihal={setPerihal}
              setPic={setPic}
              onSubmit={handleSubmit}
              onClose={onCloseFormModal}
            />
          </Modal.Body>
        </Modal>
      </div>
    </App>
  );
}
