import { useState } from "react";
import Biodata from "../../../biodata/Biodata";
import { TabNavigationButton } from "../../dashboard/TabNavigasiButton";
import FinantialHistoryBills from "./FinantialHistoryBills";
import FinantialHistoryPayments from "./FinantialHistoryPayments";

export default function FinantialHistory() {
  const [activeTab, setActiveTab] = useState("tagihan");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="p-4 border-1 rounded-sm shadow-sm">
      <Biodata showLine={false} />
      <div className="my-4">
        <div className="flex w-1/2 lg:w-1/3 gap-2">
          <TabNavigationButton
            isActive={activeTab === "tagihan"}
            onClick={() => handleTabClick("tagihan")}
            colorTab="bg-primary-green"
            padding="py-2 sm:p-2"
          >
            Tagihan & VA
          </TabNavigationButton>
          <TabNavigationButton
            isActive={activeTab === "pembayaran"}
            onClick={() => handleTabClick("pembayaran")}
            colorTab="bg-primary-green"
            padding="py-2 sm:p-2"
          >
            Pembayaran
          </TabNavigationButton>
        </div>
      </div>
      <div className="lg:col-span-4">
        {activeTab === "tagihan" && <FinantialHistoryBills />}
        {activeTab === "pembayaran" && <FinantialHistoryPayments />}
      </div>
    </div>
  );
}
