// declare
interface Window {
  require: AmdRequrie;
}

interface AmdRequrie {
  (...args): void;
  config: (...args) => void;
}
