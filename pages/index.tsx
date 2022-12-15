import Link from "next/link";
import { useRef, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { GroundFloor } from "../components/GroundFloor";
import { FirstFloor } from "../components/FirstFoor";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";

const fetcher = (url: string) => axios.get(url).then((r) => r.data);

type Book = {
  title: string;
  category: string;
  floor: string;
  bookshelf: string;
};

const useBooks = (title?: string, category?: string) => {
  const { data, error } = useSWR<Book[]>(
    `/api/books?category=${category ? category : ""}&title=${
      title ? title : ""
    }`,
    fetcher
  );
  return {
    data: data ?? ([] as Book[]),
    isLoading: !error && !data,
    isError: error,
  };
};

type Category = { label: string; category: string; src: string };

const useCategories = () => {
  const { data, error } = useSWR<Category[]>("/api/categories", fetcher);
  return {
    data: data ?? ([] as Category[]),
    isLoading: !error && !data,
    isError: error,
  };
};

export default function Demo() {
  const router = useRouter();
  const category = router.query.category as string;
  const searchTerm = router.query.searchTerm as string;
  const ref = useRef<HTMLInputElement>(null);
  const [selectedBook, setSelectedBook] = useState<Book>({
    title: "",
    category: "",
    floor: "",
    bookshelf: "",
  });
  const [clicked, setClicked] = useState<boolean>(false);
  const { data: books } = useBooks(searchTerm, category);
  const { data: categories } = useCategories();

  const getCategorySrc = (category: string) => {
    return categories.find((e) => e.category === category)?.src;
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex   border justify-center items-center p-2 shadow">
        <input
          type="text"
          placeholder="🔍 Search..."
          className="input input-bordered  w-full md:w-1/3 rounded-full case-"
          onChange={(evt) =>
            router.push({
              query: {
                ...router.query,
                searchTerm: evt.target.value,
              },
            })
          }
        />
      </div>

      <div className=" grid   sm:grid-col-1 md:grid-cols-[300px_2fr]">
        <ul className="fixed-height menu h-screen border-r  mt-0.5  hidden md:block bg-base-100 w-72 justify-items-center  overflow-y-auto ">
          <li>
            <Link href={"/"}>Όλες</Link>
          </li>
          {categories.map((sm, idx) => (
            <li key={idx}>
              <Link
                href={`/?category=${sm.category}`}
                className={clsx("whitespace-nowrap", {
                  "active ": category === sm.category,
                })}
              >
                {sm.category}
              </Link>
            </li>
          ))}
        </ul>
        <div className="h-screen md:p-8  p-0">
          <div className=" md:hidden  gap-x-3 flex text-sm font-bold w-screen overflow-x-auto  ">
            <Link className="w-full h-full flex  items-center" href={"/"}>
              <span className="py-3 whitespace-nowrap w-fit px-4 my-6 border text-center  rounded-lg  ">
                Όλες
              </span>
            </Link>

            {categories.map((t, idx) => (
              <Link
                key={idx}
                href={`/?category=${t.category}`}
                className="w-full h-full flex  items-center"
              >
                <span
                  className={clsx(
                    "py-3 whitespace-nowrap w-fit px-4 my-6 border text-center  rounded-lg  ",
                    {
                      "bg-primary": category === t.category,
                    }
                  )}
                >
                  {t.category}
                </span>
              </Link>
            ))}
          </div>

          <div className="grid grid-col-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 max-h-screen overflow-auto h-fit  p-8 pb-20">
            {books.map((obj, idx) => (
              <Link
                href={{
                  query: {
                    ...router.query,
                    title: obj.title,
                    category: obj.category,
                    floor: obj.floor,
                    bookshelf: obj.bookshelf,
                  },
                }}
                key={idx}
              >
                <div
                  onClick={() => {
                    if (!ref.current) return;
                    ref.current.checked = true;
                    setSelectedBook(obj);
                  }}
                  className="card card-compact w-full h-full bg-base-100 shadow-xl"
                >
                  <figure>
                    <picture>
                      <img
                        className="h-40"
                        src={getCategorySrc(obj.category)}
                        alt="Book"
                      />
                    </picture>
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title  xl:text-sm 2xl:text-lg">
                      {obj.title}
                    </h2>
                    <div className="font-medium xl:sticky xl:mb-8">
                      <span className="underline">Τοποθεσία </span>
                      <br />
                      <div className="flex gap-x-2  ">
                        <span>όροφος:{obj.floor}</span>
                        <span>ράφι:{obj.bookshelf}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <input
        ref={ref}
        checked={ref?.current?.checked}
        type="checkbox"
        id="my-modal"
        className="modal-toggle"
      />
      <div className="modal ">
        <div className="modal-box overflow-hidden relative lg:max-w-4xl lg:max-h-fit xl:max-w-full ">
          <label
            onClick={() => {
              if (!ref.current) return;
              ref.current.checked = false;
            }}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>

          <div>
            <h3 className="font-bold text-center md:text-lg  gap-3 h-14 mb-3 ">
              <span>{selectedBook.title}</span>
              <br />
              <span>{selectedBook.floor} </span>
              <span>{selectedBook.bookshelf}</span>
            </h3>
            <div className="divider"></div>
            <div className="grid lg:grid-cols-[0.35fr_1fr] content-center md:h-full gap-2">
              <div className="h-full w-full border-b  md:border-r ">
                <p
                  className={clsx(
                    "md:line-clamp-none",
                    {
                      "line-clamp-none": clicked,
                    },
                    { "line-clamp-3": !clicked }
                  )}
                >
                  djhfcjkdhfcjk djhfcjkdhfcjk djhfcjkdhfcjkdjhfcjkdhfcjk
                  djhfcjkdhfcjk djhfcjkdhfcjk djhfc oajisaojisdjiso
                  aidoosjaojsdojaisdjioasjoidas oijasjioasd
                  iaooajisdodjiasjoaids oijsaojiajsdio sdasdjaldalkjsd
                  asdlsjdlasdjkasdas sadaskldjasdjaksdljasd
                  sadaskldjasdjaksdljasd sadaskldjasdjaksdljasd
                  sadaskldjasdjaksdljasd sadaskldjasdjaksdljasd
                  sadaskldjasdjaksdljasd sadaskldjasdjaksdljasd
                  sadaskldjasdjaksdljasd sadaskldjasdjaksdljasd
                </p>
                <button
                  className="btn btn-primary normal-case btn-xs text-sm md:hidden"
                  onClick={() => setClicked((clicked) => !clicked)}
                >
                  Read more
                </button>
              </div>

              <div
                className={clsx(
                  " md:h-full  lg:h-[70vh] grid place-items-center w-full ",
                  {
                    " hidden": clicked,
                  }
                )}
              >
                {selectedBook.floor === "ground" ? (
                  <GroundFloor />
                ) : (
                  <FirstFloor />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
