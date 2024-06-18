import React, { useContext, useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { createQuotation, viewLiveQuotation } from '../../utils/quotation'
import './NewQuotation.css'
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from '../../store/AuthContext';
import Loader from '../../common/Loader';
import Modal from '../../components/Modal';

interface SelectCompanyProps {
    selectedOption: string;
    setIsOptionSelected: React.Dispatch<React.SetStateAction<boolean>>;
    isOptionSelected: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<any>>;
}

const SelectCompany: React.FC<SelectCompanyProps> = ({ selectedOption, setIsOptionSelected, isOptionSelected, setSelectedOption }) => {
    const authCtx = useContext(AuthContext)
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/company/all`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer :${authCtx.token}`
                    }
                });

                const res_data = await res.json();
                if (res.status !== 200) {
                    toast.error(res_data.message);
                } else {
                    setClients(res_data)
                }
            } catch (e: any) {
                toast.error(e.message);
            } finally {
                setLoading(false)
            }
        }

        if (loading === true)
            fetchProducts()
    }, [])

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    return (
        <div className="w-[70%]">
            {loading === true ? <Loader height='10'></Loader> : <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                    value={selectedOption}
                    onChange={(e: any) => {
                        setSelectedOption(clients[Number(e.target.value)]);
                        changeTextColor();
                    }}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? 'text-black dark:text-white' : ''
                        }`}
                >
                    <option value="" disabled className="text-body dark:text-bodydark">
                        Select A Company
                    </option>
                    {clients.map((c: any, index: number) => {
                        return <option value={index} className="text-body dark:text-bodydark" key={index}>
                            {c.name}
                        </option>
                    })}
                </select>

                <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g opacity="0.8">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                fill=""
                            ></path>
                        </g>
                    </svg>
                </span>
            </div>}
        </div>
    );
};


interface DocumentData {
    ref: string;
    date: string;
    company: string;
    address_line_1: string;
    address_line_2: string;
    address_line_3: string;
    address_line_4: string;
    dear: string;
    subject: string;
    introduction: string;
    items: any[];
    terms: string;
    conclusion: string;
    name: string;
    details: string;
}


const NewQuotation: React.FC = () => {
    const authCtx = useContext(AuthContext)
    const [showModal, setShowModal] = useState<boolean>(false);
    const [quotationDetails, setQuotationDetails] = useState<DocumentData>({
        ref: '',
        date: (new Date).toDateString(),
        company: '',
        address_line_1: '',
        address_line_2: '',
        address_line_3: '',
        address_line_4: '',
        dear: 'Sir',
        subject: '',
        introduction: 'We thank you for giving us an opportunity to serve your esteemed organization. We present below our best quotation for the requested items(s) as per your requirement.',
        items: [],
        terms: 'The above mentioned price is exclusive of Taxes and will be charged extra as applicable.\nDelivery – Single location delivery at Delhi will be taken care by Saraff Creations.\nLead Time – 2 days after your order confirmation.\nPrinting – Logo printing included.\nPacking – Standard Packing will be provided.\nPayment Terms – Immediately after delivery of materials.\n Validity - 2 days from the date of quotation, thereafter subject to our confirmation.',
        conclusion: 'Please confirm to your liking at the earliest possible convenience. Looking forward to doing business with you.',
        name: 'Lalit Kumar Jhanwar',
        details: '9831455721/ lalitjhanwar@outlook.com'
    })
    const [selectedOption, setSelectedOption] = useState<any>('');
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true)
    const [products, setProducts] = useState<any[]>([])
    const [selectedProducts, setSelectedProducts] = useState<any[]>([])

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/product/all-nofilters`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer :${authCtx.token}`
                    }
                });

                const res_data = await res.json();
                if (res.status !== 200) {
                    toast.error(res_data.message);
                } else {
                    setProducts(res_data)
                }
            } catch (e: any) {
                toast.error(e.message);
            } finally {
                setLoading(false)
            }
        }

        if (loading === true)
            fetchProducts()
    }, [])

    const handleGeneratePDF = async (e: any) => {
        e.preventDefault();
        for (let key in quotationDetails) {
            if (quotationDetails.hasOwnProperty(key)) {
                if (key.startsWith('address'))
                    continue;

                if (quotationDetails[key as keyof DocumentData] === '') {
                    toast.error(`${key.charAt(0).toUpperCase() + key.substring(1)} is required`);
                    return;
                }
            }
        }

        if (selectedProducts.length === 0) {
            toast.error('Select Atleast One Product To Create Quotation');
            return;
        }

        setLoading(true)

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/quotation/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer :${authCtx.token}`
                },
                body: JSON.stringify({ ...quotationDetails, items: selectedProducts })
            });

            const res_data = await res.json();
            if (res.status !== 201) {
                toast.error(res_data.message);
            } else {
                createQuotation(quotationDetails, selectedProducts)
                toast.success(res_data.message)
            }
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false)
            setSelectedProducts([])
        }
    }

    useEffect(() => {
        if (isOptionSelected === false)
            return;
        setQuotationDetails({ ...quotationDetails, company: selectedOption.name, address_line_1: selectedOption.address_line_1 ? selectedOption.address_line_1 : '', address_line_2: selectedOption.address_line_2 ? selectedOption.address_line_2 : '', address_line_3: selectedOption.address_line_3 ? selectedOption.address_line_3 : "", address_line_4: selectedOption.address_line_4 ? selectedOption.address_line_4 : "" })

    }, [selectedOption])

    return (
        <DefaultLayout>
            <Toaster />
            <Breadcrumb pageName="New Quotation" />
            {showModal === true && <Modal setShowModal={setShowModal} products={products} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />}
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                {loading === true ? <Loader height=''></Loader> : <div className="flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex justify-between items-center border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Select Company
                            </h3>
                            <SelectCompany selectedOption={selectedOption} setIsOptionSelected={setIsOptionSelected} setSelectedOption={setSelectedOption} isOptionSelected={isOptionSelected} />
                        </div>
                        <form action="#">
                            <div className="p-6.5">
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <input
                                            type="text"
                                            placeholder="Ref"
                                            value={quotationDetails.ref}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => { setQuotationDetails({ ...quotationDetails, ref: e.target.value }) }}
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <input
                                            type="text"
                                            placeholder="Date"
                                            value={quotationDetails.date}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => { setQuotationDetails({ ...quotationDetails, date: e.target.value }) }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        To
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Name Of Company"
                                        value={quotationDetails.company}
                                        className="mb-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setQuotationDetails({ ...quotationDetails, company: e.target.value }) }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Address Line 1"
                                        value={quotationDetails.address_line_1}
                                        className="mb-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setQuotationDetails({ ...quotationDetails, address_line_1: e.target.value }) }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Address Line 2"
                                        value={quotationDetails.address_line_2}
                                        className="mb-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setQuotationDetails({ ...quotationDetails, address_line_2: e.target.value }) }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Address Line 3"
                                        value={quotationDetails.address_line_3}
                                        className="mb-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setQuotationDetails({ ...quotationDetails, address_line_3: e.target.value }) }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Address Line 4"
                                        value={quotationDetails.address_line_4}
                                        className="mb-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setQuotationDetails({ ...quotationDetails, address_line_4: e.target.value }) }}
                                    />
                                </div>

                                <div className="mb-4.5">
                                    Dear
                                    <input
                                        type="text"
                                        placeholder="Sir"
                                        value={quotationDetails.dear}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setQuotationDetails({ ...quotationDetails, dear: e.target.value }) }}
                                    />
                                </div>

                                <div className="mb-4.5">
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        value={quotationDetails.subject}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setQuotationDetails({ ...quotationDetails, subject: e.target.value }) }}
                                    />
                                </div>

                                <div className="mb-6">
                                    <textarea
                                        rows={3}
                                        value={quotationDetails.introduction}
                                        placeholder="We thank you for giving us an opportunity to serve your esteemed organization. We present below our best quotation for the requested items(s) as per your requirement."
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setQuotationDetails({ ...quotationDetails, introduction: e.target.value }) }}
                                    ></textarea>
                                </div>

                                <div className='flex justify-center items-center mb-4.5 flex-col'>
                                    {selectedProducts.map((p, index) => <h3 className='text-lg mb-2'>( {index + 1} ) {p.quantity} {p.name} @ {p.rate}</h3>)}
                                    <button className="flex w-2/3 justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={(e) => { e.preventDefault(); setShowModal(true) }}>
                                        Add Products
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Terms And Conditions
                                    </label>
                                    <textarea
                                        rows={10}
                                        value={quotationDetails.terms}
                                        placeholder={`The above mentioned price is exclusive of Taxes and will be charged extra as applicable.\nDelivery – Single location delivery at Delhi will be taken care by Saraff Creations.\nLead Time – 2 days after your order confirmation.\nPrinting – Logo printing included.\nPacking – Standard Packing will be provided.\nPayment Terms – Immediately after delivery of materials.\n Validity - 2 days from the date of quotation, thereafter subject to our confirmation.`}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setQuotationDetails({ ...quotationDetails, terms: e.target.value }) }}
                                    ></textarea>
                                </div>

                                <div className="mb-6">
                                    <textarea
                                        rows={2}
                                        value={quotationDetails.conclusion}
                                        placeholder="Please confirm to your liking at the earliest possible convenience. Looking forward to doing business with you."
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setQuotationDetails({ ...quotationDetails, conclusion: e.target.value }) }}
                                    ></textarea>
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Regards<br></br>
                                        For Saraff Creations<br></br>
                                        Sd/-
                                    </label>
                                    <input
                                        type="text"
                                        value={quotationDetails.name}
                                        placeholder="Lalit Kumar Jhanwar"
                                        className="mb-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setQuotationDetails({ ...quotationDetails, name: e.target.value }) }}
                                    />
                                    Authorized Signatory
                                    <input
                                        type="text"
                                        value={quotationDetails.details}
                                        placeholder="9831455721/ lalitjhanwar@outlook.com"
                                        className="mb-1 mt-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setQuotationDetails({ ...quotationDetails, details: e.target.value }) }}
                                    />
                                </div>

                                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={handleGeneratePDF}>
                                    Generate Quotation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>}

                <div className="flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex justify-between items-center border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Live Preview
                            </h3>
                            <button className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={() => { viewLiveQuotation(quotationDetails, selectedProducts) }}>
                                Regenerate Preview
                            </button>
                        </div>
                        <div id="quotationIframeContainer"></div>
                    </div>
                </div>
            </div>

        </DefaultLayout>
    );
};

export default NewQuotation;
