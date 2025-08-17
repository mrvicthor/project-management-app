import { useParams } from "react-router-dom";
import type { Project } from "../types";
import { useQuery } from "@apollo/client/react/hooks/useQuery";
import { GET_PROJECT } from "../queries/projectQueries";
import Loading from "../components/Loading";
import ClientInfo from "../components/ClientInfo";
const ProjectDetail = () => {
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { id },
  });

  if (loading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  const project: Project = data.project;

  console.log("Project data:", project);

  return (
    <section className="flex flex-col justify-center items-center">
      <div className="border border-gray-200 rounded-lg shadow p-8 w-md">
        <div className="flex justify-end">
          <a href="/" className="text-blue-500 hover:underline self-end">
            Back
          </a>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p>{project.description}</p>
          <p className="capitalize mt-4">project status</p>
          <p className="opacity-70">{project.status}</p>
        </div>
        <ClientInfo data={project.client} />
      </div>
    </section>
  );
};

export default ProjectDetail;
