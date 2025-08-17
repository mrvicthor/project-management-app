import { useState, type ChangeEvent, type FormEvent } from "react";
import InputField from "./forms/InputField";
import TextAreaField from "./forms/TextAreaField";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CLIENTS } from "../queries/clientQueries";
import Loading from "./Loading";
import { PROJECTSTATUS, type Client, type Project } from "../types";
import { ADD_PROJECT } from "../mutations/projectMutation";
import { GET_PROJECTS } from "../queries/projectQueries";

type ProjectModalProps = {
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>;
};
const AddProjectModal = ({ toggleModal }: ProjectModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "new",
    clientId: "",
  });

  const { data, loading, error: fetchError } = useQuery(GET_CLIENTS);
  const [addProject, { loading: pending }] = useMutation(ADD_PROJECT, {
    variables: {
      name: formData.name,
      description: formData.description,
      status: formData.status,
      clientId: formData.clientId,
    },
    update(cache, { data }) {
      if (!data?.addProject) return;
      const existing = cache.readQuery<{ projects: Project[] }>({
        query: GET_PROJECTS,
      });
      if (existing && existing.projects) {
        cache.writeQuery({
          query: GET_PROJECTS,
          data: { projects: [...existing.projects, data.addProject] },
        });
      }
    },
  });

  const [error, setError] = useState({
    name: "",
    description: "",
    clientId: "",
  });
  const handleValueChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;

    try {
      console.log("Submitting project data:", formData);
      await addProject({
        variables: {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          clientId: formData.clientId,
        },
      });

      toggleModal(false);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleFocus = () => {
    if (!formData.name.length) {
      setError((prev) => ({
        ...prev,
        name: "Field can not be empty",
      }));
    } else if (formData.name.length < 3) {
      setError({
        ...error,
        name: "Name must be at least 3 characters",
      });
    }
  };

  const handleDescriptionFocus = () => {
    if (!formData.description.length) {
      setError((prev) => ({
        ...prev,
        description: "Field can not be empty",
      }));
    } else if (formData.description.length < 3) {
      setError({
        ...error,
        description: "Description must be at least 3 characters",
      });
    }
  };

  const handleClientIdFocus = () => {
    if (!formData.clientId) {
      setError({
        ...error,
        clientId: "Please select one",
      });
    }
  };

  const validateNameField = () => {
    setError((prev) => ({ ...prev, name: "" }));
  };

  const validateTextAreaField = () => {
    setError({ ...error, description: "" });
  };

  const validateClientIdField = () => {
    setError({ ...error, clientId: "" });
  };

  if (loading) {
    return <Loading />;
  }

  if (fetchError) {
    return <p>Error fetching clients data: {fetchError.message}</p>;
  }

  console.log(data);

  const isValid =
    !formData.name ||
    !formData.description ||
    !formData.status ||
    !formData.clientId;

  return (
    <section className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
        <form className="min-w-md" onSubmit={handleSubmit}>
          <InputField
            value={formData.name}
            name="name"
            validateNameField={validateNameField}
            handleFocus={handleFocus}
            label="Name"
            errorText={error.name}
            handleValueChange={handleValueChange}
          />
          <TextAreaField
            name="description"
            label="Description"
            handleDescriptionFocus={handleDescriptionFocus}
            handleValueChange={handleValueChange}
            validateTextAreaField={validateTextAreaField}
            value={formData.description}
            errorText={error.description}
          />

          <div className="pb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Status
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleValueChange}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(PROJECTSTATUS).map(([key, value]) => {
                return (
                  <option key={key} value={key}>
                    {value}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="py-4">
            <label
              htmlFor="clientId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Client ID
            </label>
            <select
              name="clientId"
              id="clientId"
              value={formData.clientId}
              onChange={handleValueChange}
              onBlur={handleClientIdFocus}
              onFocus={validateClientIdField}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a client</option>
              {data.clients.map((item: Client) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {error.clientId && (
              <span aria-live="polite" className="text-red-500 text-sm">
                {error.clientId}
              </span>
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
              disabled={isValid}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ${
                isValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddProjectModal;
