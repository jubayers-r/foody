import asyncHandler from "@/shared/utils/asyncHandler.utils";
import sendResponse from "@/shared/utils/responses.utils";
import { adminServices } from "./admin.service";

const getAllUser = asyncHandler(async (req, res) => {
  const result = await adminServices.getAllUser();

  sendResponse(res, {
    statusCode: 200,
    data: result,
    message: "Users retrieved successfully",
  });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const result = await adminServices.updateUserStatus(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    data: result,
    message: "User retrieved successfully",
  });
});

export const adminController = {
  getAllUser,
  updateUserStatus,
};
