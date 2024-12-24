export interface NewUserResponseBody {
  status: string;
  data: NewUserData;
}

export interface NewUserData {
  username: string;
  role: string;
  deluxeToken: string;
  lastLoginIp: string;
  profileImage: string;
  isActive: boolean;
  id: number;
  email: string;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: null;
}
