import axios from "axios";

export function viewsCount({ url, item, ref }) {
  if (item && item.idx && !ref.current) {
    axios.patch(`${url}/views/${item.idx}`).then(() => {
      setViews((prev) => prev + 1);
    });
    ref.current = true;
  }
}
