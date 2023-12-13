import React from "react";
import {Skeleton} from "@chakra-ui/react"
function chatLoading() {
  return <stack>
    <Skeleton height="45px" mb={2}></Skeleton>
    <Skeleton height="45px" mb={2}></Skeleton>
    <Skeleton height="45px" mb={2}></Skeleton>
    <Skeleton height="45px" mb={2}></Skeleton>
    <Skeleton height="45px" mb={2}></Skeleton>
    <Skeleton height="45px" mb={2}></Skeleton>
    <Skeleton height="45px" mb={2}></Skeleton>
    <Skeleton height="45px" mb={2}></Skeleton>
    <Skeleton height="45px" mb={2}></Skeleton>
    <Skeleton height="45px" mb={2}></Skeleton>
    <Skeleton height="45px" mb={2}></Skeleton>
  </stack>;
}

export default chatLoading;
