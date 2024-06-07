
export const networkAlias: any = {
    // alias    table명
    id: {              
      name : "",     // 0
      align : 'start',
      width : 30,
    }, 
    Accurancy: {       
      name : "정확도", // 1
      align : 'center',
      width : 30,
    },
    Time: {            
      name : "탐지시각", // 2
      align : 'start',
      width : 150,
    },
    PcName: {
      name : "PC명",     // 3
      align : 'start',
      width : 150,
    },
    Agent_ip: {
      name : "Agent Ip", // 4 
      align : 'start',
      width : 100,
    },
    protocol: {
      name : "프로토콜", // 5 
      align : 'center',
      width : 50,
    },
    SrcIp: {
      name : "출발지 Ip", // 6
      align : 'start',
      width : 100,
    },
    SrcPort: {
      name : "출발지 Port", // 7
      align : 'center',
      width : 50,
    },
    DstIp: {
      name : "목적지 Ip", // 8
      align : 'start',
      width : 50,
    },
    DstPort: {
      name : "목적지 Port", // 9
      align : 'center',
      width : 100,
    },
    Process: {
      name : "프로세스명", // 10
      align : 'start',
      width : 200,
    },
    PIDs: {
      name : "PID", // 11
      align : 'center',
      width : 50,
    },
    SrcFile: {
      name : "유출 파일명", // 12
      align : 'start',
      width : 350,
    },
    FileSizes: {
      name : "파일 크기", // 13
      align : 'right',
      width : 100,
    },
    Keywords: {
      name : "탐지패턴", // 14
      align : 'start',
      width : 200,
    },
    DestFiles: {
      name : "URL", // 15
      align : 'start',
      width : 350,
    },    DownLoad: {
      name : "파일다운로드", // 16
      align : 'center',
      width : 50,
    },
    ScreenShot: {
      name : "스크린 덤프", // 17
      align : 'center',
      width : 50,
    },
  };

  export const mediaAlias:any = {
    // alias    table명
    'id' :  {
      name : '',                   // 0
      align : 'start',
      width : 30,
    },
    'Time' : {
      name : '탐지시각',           // 1
      align : 'start',
      width : 150,
    },
    'PcName' : {
      name : 'PC명',           // 2
      align : 'start',
      width : 150,
    },
    'Agent_ip' : {
      name : 'Agent Ip',       // 3
      align : 'start',
      width : 100,
    },
    'Process' : {
      name : '프로세스명',         // 4
      align : 'start',
      width : 200,
    },
    'Media_Type' : {
      name : '유출 유형',   // 5
      align : 'center',
      width : 50,
    },
    'Files' : {
      name : '유출 파일명',              // 6
      align : 'start',
      width : 350,
    },
    // 'Copied_files' : {
    //   name : '복사본', // 7
    //   align : 'start',
    //   width : 'auto',
    // },
    'Downloading' : {
      name : '파일 다운로드',  // 8
      align : 'center',
      width : 30,
    },
    'FileSizes' : {
      name : '파일 크기',     // 9
      align : 'right',
      width : 100,
    },
    'Keywords' : {
      name : '탐지패턴',       // 10
      align : 'start',
      width : 300,
    },
  };

  export const outlookAlias:any = {
    // alias    table명
    'id' : {
      name : '',                    // 0
      align : 'start',
      width : 30,
    },
    'Time' : {
      name : '탐지시각',                // 1
      align : 'start',
      width : 150,
    },
    'PcName' : {
      name : 'PC명',            // 2
      align : 'start',
      width : 150,
    },
    'Agent_ip' : {
      name : 'Agent Ip',        // 3
      align : 'start',
      width : 100,
    },
    'Process' : {
      name : '프로세스명',          // 4
      align : 'start',
      width : 200,
    },
    'PIDS' : {
      name : 'pid',                 // 5
      align : 'center',
      width : 50,
    },
    'Mail_Subjects' : {
      name : '메일명',    // 6
      align : 'start',
      width : 150,
    },
    'Sender' : {
      name : '보낸사람',            // 7
      align : 'start',
      width : 150,
    },
    'Receiver' : {
      name : '받은사람',        // 8
      align : 'start',
      width : 150,
    },
    'AttachedFiles' : {
      name : '유출 파일명', // 9
      align : 'start',
      width : 300,
    },
    'CopiedFiles' : {
      name : '전송갯수',   // 10
      align : 'center',
      width : 30,
    },
    'Downloading' : {
      name : '파일 다운로드',   // 11
      align : 'center',
      width : 30,
    },
    'FileSizes' : {
      name : '파일 크기',      // 12
      align : 'right',
      width : 100,
    },
    'Keywords' : {
      name : '탐지 패턴',        // 13
      align : 'start',
      width : 200,
    },
  };

  export const printAlias:any = {
    // alias    table명
    'id' : {
      name : '',                       // 0
      align : 'start',
      width : 30,
    },
    'Time' : {
      name : '탐지시각',                   // 1
      align : 'start',
      width : 150,
    },
    'PcName' : {
      name : 'PC명',               // 2
      align : 'start',
      width : 150,
    },
    'Agent_ip' : {
      name : 'Agent Ip',           // 3
      align : 'start',
      width : 100,
    },
    'Process' : {
      name : '프로세스명',             // 4
      align : 'start',
      width : 200,
    },
    'PIDs' : {
      name : 'pid',                    // 5
      align : 'center',
      width : 50,
    },
    'Printers' : {
      name : '프린터',            // 6
      align : 'start',
      width : 200,
    },
    'Owners' : {
      name : '관리자',                // 7
      align : 'center',
      width : 100,
    },
    'Documents' : {
      name : '인쇄 파일명',          // 8
      align : 'start',
      width : 300,
    },
    // 'Copied_Spool_Files' : {
    //   name : '복사본', // 9
    //   align : 'start',
    //   width : 'auto',
    // },
    'Downloading' : {
      name : '파일 다운로드',        // 10
      align : 'center',
      width : 30,
    },
    'Sizes' : {
      name : '파일 크기',                  // 11
      align : 'right',
      width : 30,
    },
    'Pages' : {
      name : '페이지 수',                 // 12
      align : 'center',
      width : 30,
    },
  };

  export const agentInfoAlias:any = {
    // alias    table명
    'pc_guid' : {
      name : 'PC GUID',                       // 0
      align : 'center',
      width : 300,
    },
    'time' : {
      name : '업데이트 시각',                   // 1
      align : 'center',
      width : 300,
    },
    'pc_name' : {
      name : 'PC명',               // 2
      align : 'center',
      width : 300,
    },
    'latest_agent_ip' : {
      name : 'Agent Ip',           // 3
      align : 'center',
      width : 300,
    },
  };

  export const userAlias: any = {
    id:"id",
    username:"사용자 계정명",
    privilege:"등급",
    enabled:"상태",
    ip_ranges:"IP 관리 대역"
  }

  export const complexAlias:any = {
    id:'id',
    pc_name:"PC명",
    proc_name:"프로세스명",
    backup_file:"유출 파일명",
    media_type:"유출 유형",
    org_file:"유출 파일명",
    sender:"보낸사람",
    printer:"프린터",
    doc_name:"탐지문서",
    subject:"메일명"
  }

  export const analysisAlias:any = {
    pcGuid:'PC GUID',
    pcName:'PC명(IP주소)',
    status:"(위험도) 위험점수 합계",
    text:"설명",
    progress:"정규화"
    
  }