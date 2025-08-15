import { useForm } from "react-hook-form";
import type { ClientFormData } from "../types";
import { useMutation } from "@apollo/client";
import { ADD_CLIENT } from "../mutations/clientMutation";
import { GET_CLIENTS } from "../queries/clientQueries";

type AddClientModalProps = {
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddClientModal = ({ toggleModal }: AddClientModalProps) => {
  const [addClient] = useMutation(ADD_CLIENT);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>();

  const onSubmit = async (data: ClientFormData) => {
    try {
      await addClient({
        variables: {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },

        update(cache, { data }) {
          if (!data?.addClient) return;
          const existing = cache.readQuery<{ clients: ClientFormData[] }>({
            query: GET_CLIENTS,
          });
          if (existing && existing.clients) {
            cache.writeQuery({
              query: GET_CLIENTS,
              data: { clients: [...existing.clients, data.addClient] },
            });
          }
        },
      });
      toggleModal(false);
    } catch (err) {
      console.error("Error adding client:", err);
    }
  };

  return (
    <section className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Add Client</h2>
        <form className="min-w-md" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter client name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p aria-live="polite" className="text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter client email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p aria-live="polite" className="text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter client phone"
              {...register("phone", { required: "Phone is required" })}
            />
            {errors.phone && (
              <p aria-live="polite" className="text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => toggleModal(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add Client
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddClientModal;
