export interface InputProps {
  title?: string;
  inputPlaceholder?: string;
  textArea?: boolean;
  value?: string | null;
  onChange: (value: string) => void;
  preview?: boolean;
}
