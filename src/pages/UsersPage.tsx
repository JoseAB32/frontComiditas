import { useEffect, useState } from "react";
import Seo from "../components/Seo";
import StatusMessage from "../components/StatusMessage";
import type { UserListItem } from "../interfaces/user.interface";
import { getUsers } from "../services/userService";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function UsersPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        setIsLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (loadError) {
        setError(getErrorMessage(loadError, "No se pudo cargar la lista de personas registradas."));
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <main className="users-page">
      <Seo
        title="Usuarios"
        description="Personas registradas en Comiditas Jose."
      />

      <section className="container page-heading">
        <div>
          <p className="section-kicker">Contactos</p>
          <h1>Personas registradas</h1>
          <p>Listado de personas registradas para consultar nombre y correo.</p>
        </div>
      </section>

      <section className="container users-panel">
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        {isLoading ? (
          <StatusMessage type="info">Cargando usuarios...</StatusMessage>
        ) : (
          <div className="table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={`${user.source}-${user.id}`}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
