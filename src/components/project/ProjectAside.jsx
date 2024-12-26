/* eslint-disable react/prop-types */
import ProjectAsideSection from "./ProjectAsideSection";
import { CustomSearch } from "../Search";
import { useState } from "react";
import { AddProjectModal, ModifyProjectModal, TemplateSelection } from "./_Modal";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios.jsx";

function ProjectAside({setProjectId}) {

  const [openSections, setOpenSections] = useState({
    waiting: true,
    inProgress: true,
    completed: false,
  });
  const [activeItemId, setActiveItemId] = useState(null); // 활성화된 항목의 ID를 상태로 관리
  const [modifyItemId, setModifyItemId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const handleOpenModifyModal = () => setIsModifyModalOpen(true);
  const handleOpenTemplateModal = () => setIsTemplateModalOpen(true);
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setIsTemplateModalOpen(false); // 템플릿 선택 창 닫기
    setIsModalOpen(true); // AddProjectModal 열기
  };
  const handleCloseAddModal = () => setIsModalOpen(false);


  // 프로젝트 데이터를 가져오는 함수
  const fetchProjectsList = async () => {
    try {
      const res = await axiosInstance.get("/api/projects");
      return res.data;
    } catch (err) {
      return err;
    }
  };

  // useQuery 사용, refetch는 반환되는 객체에서 가져옴
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["projects", openSections, isChanging, isModifyModalOpen], // openSections 상태가 변경될 때마다 쿼리 새로 호출
    queryFn: fetchProjectsList,
  });

  const projects = {
    waiting: { title: "대기중인 프로젝트", items: data?.waiting || [] },
    inProgress: { title: "진행중인 프로젝트", items: data?.inProgress || [] },
    completed: { title: "완료된 프로젝트", items: data?.completed || [] },
  };

  const count = data?.count;

  const handleItemClick = async (id) => {
    setActiveItemId(id); // 클릭된 항목의 ID를 활성화
    try {
      setProjectId(id)
    } catch (err) {
      console.error(err)
    }
  };
  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col max-w-full min-h-[100%] w-[270px] grow justify-between items-center p-2.5 border rounded-3xl">
      {/* Header Section */}
      <section className="flex flex-col w-full min-h-[479px]">
        <h1 className="text-center text-black p-3">
          <span className="text-lg">내 프로젝트 ({count})</span>
        </h1>
        <CustomSearch width1="200" />

        {/* Dynamic Sections */}
        {Object.entries(projects).map(([key, section]) => (
          <ProjectAsideSection
            key={key}
            data={section}
            isCompleted={key === "completed"}
            isOpen={openSections[key]}
            setIsChanging = {setIsChanging}
            toggleSection={() => toggleSection(key)}
            activeItemId={activeItemId}
            onItemClick={handleItemClick}
            setModifyItemId={setModifyItemId}
            handleOpenModifyModal={()=>{handleOpenModifyModal(); refetch()}}
          />
        ))}
      </section>

      {/* Footer Section */}
      <section className="flex flex-col w-full">
        <div className="flex flex-col justify-center items-center self-center mt-2.5 w-full text-base text-center text-black">
          <hr className="w-full border border-solid border-neutral-500" />
          <button className="pt-3 pb-2" onClick={handleOpenTemplateModal}>
            새 프로젝트 생성
          </button>
        </div>
      </section>
      <TemplateSelection
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleTemplateSelect}
      />
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={()=>{handleCloseAddModal(); refetch()}}
        onItemClick={handleItemClick}
        text="새 프로젝트"
        selectedTemplate={selectedTemplate} // 선택된 템플릿 전달
      />
      <ModifyProjectModal
        isOpen={isModifyModalOpen}
        onClose={()=>{
          setIsModifyModalOpen(false);
        }}
        projectId={modifyItemId}
      />
    </div>
  );
}

export default ProjectAside;
