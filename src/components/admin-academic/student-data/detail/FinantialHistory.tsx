import { useState } from "react";
import Biodata from "../../../biodata/Biodata";
import { TabNavigationButton } from "../../dashboard/TabNavigasiButton";
import FinantialHistoryBills from "./FinantialHistoryBills";
import FinantialHistoryPayments from "./FinantialHistoryPayments";
import { BriefStudentData } from "./BriefStudentData";

export default function FinantialHistory() {
  const [activeTab, setActiveTab] = useState("tagihan");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="p-4 border rounded-sm shadow-sm">
      <BriefStudentData showLine={false}/>
      <div className="my-4">
        <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 shadow-inner gap-1">
          <TabNavigationButton
            isActive={activeTab === "tagihan"}
            onClick={() => handleTabClick("tagihan")}
            colorTab="bg-primary-green"
            padding="py-2 px-4"
          >
            Tagihan & VA
          </TabNavigationButton>
          <TabNavigationButton
            isActive={activeTab === "pembayaran"}
            onClick={() => handleTabClick("pembayaran")}
            colorTab="bg-primary-green"
            padding="py-2 px-4"
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
