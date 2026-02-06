import asyncHandler from "@/shared/utils/asyncHandler.utils";
import sendResponse from "@/shared/utils/responses.utils";
import { userService } from "./user.service";

const getMe = asyncHandler(async (req, res) => {
  const result = await userService.getMe(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    data: result,
    message: "User retrieved successfully",
  });
});

export const userController = { getMe };
