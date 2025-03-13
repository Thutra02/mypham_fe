import React, { useState } from "react";
import { faqData } from "../../data/data";
export interface PageFaqProps {
    className?: string;
}




const PageFaq: React.FC<PageFaqProps> = ({
    className = ""
}) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    return (
        <div className={`nc-PageFaq ${className}`}
            data-nc-id="PageFaq"
        >
            <title>Faq || fashionFactory React Template</title>
         
            <div className="container py-16 lg:py-28 space-y-16 lg:space-y-28">
                <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
                {faqData.map((category, catIndex) => (
                    <div key={catIndex} className="grid grid-cols-12 gap-4 items-start border-b py-4">
                        <h3 className="col-span-4 text-xl font-semibold">{category.title}</h3>
                        <div className="col-span-8">
                            {category.items.map((item, index) => {
                                const itemIndex = catIndex * 10 + index;
                                return (
                                    <div key={index} className="border-b py-2">
                                        <button
                                            className="flex justify-between w-full text-left text-lg font-medium py-2"
                                            onClick={() => toggleFAQ(itemIndex)}
                                        >
                                            {item.question}
                                            <span>{openIndex === itemIndex ? "-" : "+"}</span>
                                        </button>
                                        {openIndex === itemIndex && <p className="mt-2 text-gray-600">{item.answer}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default PageFaq