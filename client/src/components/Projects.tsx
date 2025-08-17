import { useQuery } from "@apollo/client";
import { GET_PROJECTS } from "../queries/projectQueries";
import type { Project } from "../types";

const Projects = () => {
  const { loading, error, data } = useQuery(GET_PROJECTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section>
      <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.projects.map((project: Project) => (
          <li
            key={project.id}
            className="w-md border border-gray-200 p-4 mb-2 rounded"
          >
            <div className="flex justify-between items-center mb-2">
              <h3>{project.name}</h3>
              <a
                href={`/project/${project.id}`}
                className="text-blue-500 hover:underline"
              >
                View Details
              </a>
            </div>
            <p className="text-gray-600">
              Status:{" "}
              <span className="font-medium text-black">{project.status}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Projects;
