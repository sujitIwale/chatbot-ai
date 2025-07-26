import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/chatbots">View Chat Bots</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/create">Create New Bot</Link>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
