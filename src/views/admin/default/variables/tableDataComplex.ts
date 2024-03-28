import { useEffect, useState } from "react";
import { backIP } from "utils/ipDomain";

type RowObj = {
	name: string;
	status: string;
	date: string;
	progress: number;
};
type DataItem = {
	id: Number,
	time: String,
	pcname: String,
	process: String,
	pid: String,
	agent_ip: String,
	src_ip: String,
	src_port: String,
	dst_ip: String,
	dst_port: String,
	src_file: String,
	down_state: String,
	scrshot_downloaded: String,
	file_size: String,
	keywords: String,
	dst_file: String,
	saved_file: String,
	accuracy: Number,
	evCO: String,
	evFA: String,
	evSA: String,
	isprinted: Number,
	asked_file: Number
};

// const fetchData = async (): Promise<DataItem[]> => {
// 	try {
// 	  const response = await fetch(`${backIP}/api/detectfiles`);
// 	  const dataItem = await response.json();
// 	  return dataItem;
// 	} catch (error) {
// 	  return [];
// 	}
//   };

//   const selectDetectFiles = async (): Promise<DataItem[]> => {
// 	const data = await fetchData();
// 	return data;
// 	// return data;
//   };

const tableDataComplex: RowObj[] = [
	{
		name: 'Horizon UI PRO',
		progress: 75.5,
		status: 'Approved',
		date: '12 Jan 2021'
	},
	{
		name: 'Horizon UI Free',
		progress: 25.5,
		status: 'Disable',
		date: '21 Feb 2021'
	},
	{
		name: 'Weekly Update',
		progress: 90,
		status: 'Error',
		date: '13 Mar 2021'
	},
	{
		name: 'Marketplace',
		progress: 50.5,
		status: 'Approved',
		date: '24 Oct 2022'
	}
];
// export default selectDetectFiles;
