import { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { getUser } from "../Action/action";

export default function UserList() {
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    setLoader(true);
    try {
      const res = await getUser();
      if (res?.data) {
        setUserData(res.data);
      } else {
        Swal.fire("Error", "Failed to fetch users", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoader(false);
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
  ];

  return (
    <>
      <div className="wrapper">
        <Header />
        <Sidebar />

        <div className="content-wrapper">
          <section className="content">
            <div className="box">
              <div className="box-header with-border">
                <h4 className="box-title">User List</h4>
              </div>

              <div className="box-body">
                {!loader ? (
                  <DataTable
                    columns={columns}
                    data={userData}
                    pagination
                    highlightOnHover
                  />
                ) : (
                  <center>
                    <h4>
                      <i className="fa fa-spinner fa-spin"></i> Loading...
                    </h4>
                  </center>
                )}
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}
