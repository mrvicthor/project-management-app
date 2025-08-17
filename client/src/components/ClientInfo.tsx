import type { Client } from "../types";
import { FaUserCircle, FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
type ClientInfoProps = {
  data: Client;
};

const ClientInfo = ({ data }: ClientInfoProps) => {
  return (
    <>
      <h3 className="text-xl font-medium opacity-80 mt-4">
        Client Information
      </h3>
      <ul className=" mt-2 p-4 border border-gray-200 rounded-lg shadow divide-y-1 divide-gray-200 space-y-2">
        <li className="pb-2">
          <FaUserCircle className="inline-block mr-2" />
          Name: {data.name}
        </li>
        <li className="pb-2">
          <MdEmail className="inline-block mr-2" />
          Email: {data.email}
        </li>
        <li className="">
          <FaPhone className="inline-block mr-2" />
          Phone: {data.phone}
        </li>
      </ul>
    </>
  );
};

export default ClientInfo;
