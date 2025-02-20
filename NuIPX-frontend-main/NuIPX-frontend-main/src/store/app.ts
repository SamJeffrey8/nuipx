import { create } from "zustand";

export type IModalState =
  | "LOADING"
  | "UPLOAD_MEDIA"
  | "UPLOAD_DESCI"
  | "TOKEN_INFO_MEDIA"
  | "TOKEN_INFO_DESCI"
  | null;

type IModalPayload = {
  title?: string;
  ticket_id?: string;
  entry_identifier?: string;

  event_id?: string; // BUY_TICKET
  subevent_id?: number; // BUY_TICKET,

  get_ticket?: "DOWNLOAD" | "EMAIL" | "CLAIM";
} | null;

interface AppStore {
  modal: {
    state: IModalState;
    payload?: IModalPayload;
  };
  setModal: (m_state: IModalState, payload?: IModalPayload) => void;

  filter_date: string | null;
  setFilterDate: (date: string | null) => void;

  mediaFile: { type: string; url: string };
  setMediaFile: (type: string, url: string) => void;
}

export const useAppStore = create<AppStore>()((set) => ({
  filter_date: null,
  modal: {
    payload: null,
    state: null,
  },
  mediaFile: { type: "", url: "" },
  setFilterDate: (date: string | null) => set(() => ({ filter_date: date })),
  setModal: (m_state: IModalState, payload?: IModalPayload) =>
    set(() => ({ modal: { payload, state: m_state } })),
  setMediaFile: (type: string, url: string) =>
    set(() => ({
      mediaFile: { type, url },
    })),
}));
