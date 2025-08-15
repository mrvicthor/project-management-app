import { useQuery, useMutation } from "@apollo/client";
import { type Client } from "../types";
import { GET_CLIENTS } from "../queries/clientQueries";
import Loading from "./Loading";
import { FaTrash, FaEdit } from "react-icons/fa";
import { DELETE_CLIENT } from "../mutations/clientMutation";
import { createPortal } from "react-dom";
import { useState } from "react";
import AddClientModal from "./AddClientModal";
const Clients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, error, data } = useQuery(GET_CLIENTS);
  const [deleteClient] = useMutation(DELETE_CLIENT);

  const handleDelete = (clientId: string) => {
    console.log("Deleting client with ID:", clientId);
    deleteClient({
      variables: {
        id: clientId,
      },
      update(cache, { data }) {
        if (!data?.deleteClient) return;
        const existing = cache.readQuery<{ clients: Client[] }>({
          query: GET_CLIENTS,
        });
        if (existing && existing.clients) {
          cache.writeQuery({
            query: GET_CLIENTS,
            data: {
              clients: existing.clients.filter(
                (c) => c.id !== data.deleteClient.id
              ),
            },
          });
        }
      },
    });
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <section>
        <div className="flex justify-between items-center mb-4 mt-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-500">Clients</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Client
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data &&
                data.clients &&
                data.clients.map((client: Client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {client.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded transition-colors cursor-pointer">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded transition-colors cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {isModalOpen &&
          createPortal(
            <AddClientModal toggleModal={setIsModalOpen} />,
            document.body
          )}
      </section>
    </div>
  );
};

export default Clients;
