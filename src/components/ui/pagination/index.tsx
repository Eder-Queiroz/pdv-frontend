import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
interface PaginationProps {
  limit: number;
  page: number;
  total: number;
  setPage: (page: number, limit: number) => void;
}

const MAX_ITEMS = 9;
const MAX_LEFT = (MAX_ITEMS - 1) / 2;

const Pagination = ({ limit, page, total, setPage }: PaginationProps) => {
  const current = page ? page : 1;
  const pages = Math.ceil(total / limit);
  const first = Math.max(current - MAX_LEFT, 1);

  const prePage = () => {
    if (current !== 1) {
      setPage(current - 1, limit);
    }
  };

  const changCurrentPage = (number: number) => {
    setPage(number, limit);
  };

  const nextPage = () => {
    if (current !== pages) {
      setPage(current + 1, limit);
    }
  };

  return (
    <div className="flex justify-between my-2">
      <nav className="flex rounded-lg">
        <button
          className={`flex justify-center items-center h-10 w-10 rounded-l-lg border border-r-0 border-primary-400 text-light-900 ${
            current != 1 ? "hover:bg-primary-400 hover:text-light-100" : ""
          } disabled:cursor-not-allowed`}
          onClick={() => prePage()}
          disabled={current === 1}
        >
          <IoIosArrowBack size={16} />
        </button>
        {Array.from({ length: Math.min(MAX_ITEMS, pages) })
          .map((_, index) => index + first)
          .map((currentPage, i) => (
            <button
              key={i}
              className={`h-10 w-10 border border-r-0 border-primary-400 ${
                currentPage === page ? "bg-primary-400 text-light-100" : ""
              }`}
              onClick={() => changCurrentPage(currentPage)}
            >
              {currentPage}
            </button>
          ))}
        <button
          className={`flex justify-center items-center h-10 w-10 rounded-r-lg border border-primary-400 text-light-900 ${
            current != pages ? "hover:bg-primary-400 hover:text-light-100" : ""
          } disabled:cursor-not-allowed`}
          onClick={() => nextPage()}
          disabled={current === pages}
        >
          <IoIosArrowForward size={16} />
        </button>
      </nav>
      <div className="w-20">
        <select
          name="recordPerPage"
          id="recordPerPage"
          className="h-10 p-2 border bg-transparent border-primary-400 text-light-900"
          onChange={(e) =>
            e.target.value === "todos"
              ? setPage(current, total)
              : setPage(current, parseInt(e.target.value))
          }
        >
          <option defaultValue={6}>6</option>
          <option defaultValue={10}>10</option>
          <option defaultValue={15}>15</option>
          <option defaultValue={20}>20</option>
          <option defaultValue={"todos"}>todos</option>
        </select>
      </div>
    </div>
  );
};

export { Pagination };
