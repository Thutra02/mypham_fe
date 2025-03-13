import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

interface Props {
  panelClassName?: string;
  data?: { name: string; content: string }[];
}

const AccordionInfo: FC<Props> = ({
  panelClassName = "p-4 pt-3 last:pb-0 text-slate-600 text-sm dark:text-slate-300 leading-6 break-words",
  data,
}) => {
  return (
    <div className="w-full   mx-auto space-y-3">
      {data?.map((item, index) => (
        <Disclosure key={index} defaultOpen={index < 2}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex items-center justify-between w-full px-4 py-3 font-medium text-left bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all">
                <span className="text-base sm:text-lg break-words">{item.name}</span>
                {open ? (
                  <MinusIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <PlusIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                )}
              </Disclosure.Button>
              <Disclosure.Panel
                className={`${panelClassName} bg-white dark:bg-slate-900 rounded-lg shadow-md transition-all`}
              >
                <div className="px-4 py-3 break-words">{item.content}</div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
};

export default AccordionInfo;
