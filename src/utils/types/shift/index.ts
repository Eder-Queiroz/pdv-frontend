import UserType from "../user";

type ChangedType = {
  reinforcement: number;
  sangria: number;
};

type ShiftType = {
  id: number;
  user: UserType;
  start_time: string;
  end_time: string;
  start_cash: number;
  end_cash: number;
  is_opened: boolean;
  changeds: ChangedType;
};

export default ShiftType;
