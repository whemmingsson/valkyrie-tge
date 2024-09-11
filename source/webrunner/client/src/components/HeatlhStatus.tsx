import { useEffect, useState } from "react";
import Button from "./Button"
import useServerHealth from "../hooks/useServerHealth";

const HealthStatus = () => {
    const healthCheck = useServerHealth();

    return (
        <>
            <span>Server is running: {
                healthCheck?.data === "OK" ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>
            }</span>
            <Button
                onClick={() => healthCheck.refetch()}>Check server</Button></>)
}

export default HealthStatus;