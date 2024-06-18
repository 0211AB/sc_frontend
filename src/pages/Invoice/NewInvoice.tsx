import React, { useContext, useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import toast, { Toaster } from 'react-hot-toast';
import { createInvoice, viewLiveInvoice } from '../../utils/invoice';
import './NewInvoice.css'
import statesData from '../../utils/state_code';
import Loader from '../../common/Loader';
import AuthContext from '../../store/AuthContext';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

interface SelectCompanyProps {
    selectedCompany: any | null;
    setIsCompanySelected: React.Dispatch<React.SetStateAction<boolean>>;
    isCompanySelected: boolean;
    setselectedCompany: React.Dispatch<React.SetStateAction<any>>;
}

const SelectCompany: React.FC<SelectCompanyProps> = ({ setIsCompanySelected, isCompanySelected, setselectedCompany }) => {
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

    return (
        <div className="w-[70%]">
            {loading === true ? <Loader height='10'></Loader> : <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                    defaultValue={""}
                    onChange={(e: any) => {
                        setselectedCompany(clients[Number(e.target.value)]);
                        setIsCompanySelected(true);
                    }}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isCompanySelected ? 'text-black dark:text-white' : ''
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


interface SelectStateProps {
    invoiceDetails: any;
    setinvoiceDetails: React.Dispatch<React.SetStateAction<any>>;
    type: string;
}

const SelectState: React.FC<SelectStateProps> = ({ invoiceDetails, setinvoiceDetails, type }) => {
    const [selectedCompany, setselectedCompany] = useState<string>('');
    const [isCompanySelected, setIsCompanySelected] = useState<boolean>(false);

    const changeTextColor = (num: number) => {
        setIsCompanySelected(true);
        setinvoiceDetails({
            ...invoiceDetails, [type]: statesData[num - 1].name, [type + 'code']: statesData[num - 1].gst_code + '/' + statesData[num - 1].alpha_code
        })
    };

    return (
        <div>
            <div className="relative z-20 bg-white dark:bg-form-input">
                <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g opacity="0.8">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z"
                                fill="#637381"
                            ></path>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z"
                                fill="#637381"
                            ></path>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.50084 10.0008C7.55796 12.5632 8.4392 15.0301 10.0006 17.0418C11.5621 15.0301 12.4433 12.5632 12.5005 10.0008C12.4433 7.43845 11.5621 4.97153 10.0007 2.95982C8.4392 4.97153 7.55796 7.43845 7.50084 10.0008ZM10.0007 1.66749L9.38536 1.10547C7.16473 3.53658 5.90275 6.69153 5.83417 9.98346C5.83392 9.99503 5.83392 10.0066 5.83417 10.0182C5.90275 13.3101 7.16473 16.4651 9.38536 18.8962C9.54325 19.069 9.76655 19.1675 10.0007 19.1675C10.2348 19.1675 10.4581 19.069 10.6159 18.8962C12.8366 16.4651 14.0986 13.3101 14.1671 10.0182C14.1674 10.0066 14.1674 9.99503 14.1671 9.98346C14.0986 6.69153 12.8366 3.53658 10.6159 1.10547L10.0007 1.66749Z"
                                fill="#637381"
                            ></path>
                        </g>
                    </svg>
                </span>

                <select
                    value={selectedCompany}
                    onChange={(e) => {
                        setselectedCompany(e.target.value);
                        changeTextColor(Number(e.target.value));
                    }}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${isCompanySelected ? 'text-black dark:text-white' : ''
                        }`}
                >
                    <option value="" disabled className="text-body dark:text-bodydark">
                        Select State
                    </option>
                    {statesData.map(state => <option value={state.sl_no} className="text-body dark:text-bodydark">
                        {state.name}
                    </option>)}
                </select>

                <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                    <svg
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
                                fill="#637381"
                            ></path>
                        </g>
                    </svg>
                </span>
            </div>
        </div>
    );
};

interface DocumentData {
    number: string;
    date: string;
    name: string;
    address: string;
    purchase_order_number: string;
    recipient_gst_state: string;
    recipient_gst_statecode: string;
    place_of_supply_gst_state: string;
    place_of_supply_gst_statecode: string;
    place_of_supply: string;
    can_reverse: boolean,
    gst: string;
    packaging: string;
    isIGST: boolean;
}

const NewInvoice: React.FC = () => {
    const navigate = useNavigate()
    const authCtx = useContext(AuthContext)
    const [selectedCompany, setselectedCompany] = useState<any>({ name: "" });
    const [isCompanySelected, setIsCompanySelected] = useState<boolean>(false);
    const [invoiceDetails, setinvoiceDetails] = useState<DocumentData>({
        number: '',
        date: (new Date).getDate() + ' ' + months[(new Date).getUTCMonth()] + ' ' + (new Date).getFullYear(),
        name: '',
        address: '',
        place_of_supply: '',
        can_reverse: false,
        gst: '',
        purchase_order_number: '',
        recipient_gst_state: '',
        recipient_gst_statecode: '',
        place_of_supply_gst_state: '',
        place_of_supply_gst_statecode: '',
        packaging: '',
        isIGST: false
    })
    const [showModal, setShowModal] = useState<boolean>(false);
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

        const fetchInvoiceNumber = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/invoice/last`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer :${authCtx.token}`
                    }
                });

                const res_data = await res.json();
                if (res.status !== 201) {
                    toast.error(res_data.message);
                    setinvoiceDetails({ ...invoiceDetails, number: res_data.inv })
                } else {
                    setinvoiceDetails({ ...invoiceDetails, number: res_data })
                }
            } catch (e: any) {
                // toast.error(e.message);
            } finally {
                setLoading(false)
            }
        }

        if (loading === true) {
            fetchProducts()
            fetchInvoiceNumber()
        }
    }, [])

    useEffect(() => {
        setinvoiceDetails({
            ...invoiceDetails, name: selectedCompany?.name, address: (selectedCompany.address_line_1 ? selectedCompany.address_line_1 + ", " : "") +
                (selectedCompany.address_line_2 ? selectedCompany.address_line_2 + ", " : "") +
                (selectedCompany.address_line_3 ? selectedCompany.address_line_3 + ", " : "") +
                (selectedCompany.address_line_4 ? selectedCompany.address_line_4 + ", " : ""), gst: selectedCompany?.gst_number ? selectedCompany?.gst_number : ""
        })
    }, [selectedCompany])

    const handleGeneratePDF = async (e: any) => {
        e.preventDefault();
        if (selectedProducts.length === 0) {
            toast.error('Select Atleast One Product For Generating Invoice')
            return;
        }

        for (let key in invoiceDetails) {
            if (invoiceDetails.hasOwnProperty(key)) {
                if (key.startsWith('packaging'))
                    continue;

                if (invoiceDetails[key as keyof DocumentData] === '') {
                    toast.error(`${key.charAt(0).toUpperCase() + key.substring(1)} is required`);
                    return;
                }
            }
        }

        const regex = /^20\d{2}-\d{2}\/INV-\d{3}$/;
        if (regex.test(invoiceDetails.number) === false) {
            toast.error('Invalid invoice type. Please enter a valid invoice type like "2024-25/INV-020".');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/invoice/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer :${authCtx.token}`
                },
                body: JSON.stringify({
                    ...invoiceDetails, items: selectedProducts
                })
            });

            const res_data = await res.json();
            if (res.status !== 201) {
                toast.error(res_data.message);
            } else {
                createInvoice(invoiceDetails, selectedProducts)
                toast.success(res_data.message)
                setTimeout(() => { navigate('/invoices/all') }, 2000)
            }
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false)
            setSelectedProducts([])
        }
    }

    return (
        <DefaultLayout>
            <Toaster />
            <Breadcrumb pageName="NewInvoice" />
            {showModal === true && <Modal setShowModal={setShowModal} products={products} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />}
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                {loading === true ? <Loader height='full' /> : <div className="flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex justify-between items-center border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Select Company
                            </h3>
                            <SelectCompany selectedCompany={selectedCompany} setIsCompanySelected={setIsCompanySelected} setselectedCompany={setselectedCompany} isCompanySelected={isCompanySelected} />
                        </div>
                        <form action="#">
                            <div className="p-6.5">
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <input
                                            type="text"
                                            placeholder="Invoice Number"
                                            value={invoiceDetails.number}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => { setinvoiceDetails({ ...invoiceDetails, number: e.target.value }) }}
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <input
                                            type="text"
                                            placeholder="Invoice Date"
                                            value={invoiceDetails.date}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => { setinvoiceDetails({ ...invoiceDetails, date: e.target.value }) }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Recipient Details
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={invoiceDetails.name}
                                        className="mb-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setinvoiceDetails({ ...invoiceDetails, name: e.target.value }) }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="GSTIN"
                                        value={invoiceDetails.gst}
                                        className="mb-1 w-1/2 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setinvoiceDetails({ ...invoiceDetails, gst: e.target.value }) }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Purchase Order Number"
                                        value={invoiceDetails.purchase_order_number}
                                        className="mb-1 w-1/2 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setinvoiceDetails({ ...invoiceDetails, purchase_order_number: e.target.value }) }}
                                    />
                                    <textarea
                                        rows={3}
                                        placeholder="Address"
                                        value={invoiceDetails.address}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setinvoiceDetails({ ...invoiceDetails, address: e.target.value }) }}
                                    ></textarea>
                                    <textarea
                                        rows={3}
                                        placeholder="Place Of Supply"
                                        value={invoiceDetails.place_of_supply}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) => { setinvoiceDetails({ ...invoiceDetails, place_of_supply: e.target.value }) }}
                                    ></textarea>
                                    <div className='flex justify-end w-full'>
                                        <label
                                            htmlFor="checkboxLabelOne"
                                            className="flex cursor-pointer select-none items-center"
                                        >
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    id="checkboxLabelOne"
                                                    className="sr-only"
                                                    onChange={() => { setinvoiceDetails({ ...invoiceDetails, can_reverse: !invoiceDetails.can_reverse }) }}
                                                />
                                                <div
                                                    className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${invoiceDetails.can_reverse && 'border-primary bg-gray dark:bg-transparent'
                                                        }`}
                                                >
                                                    <span
                                                        className={`h-2.5 w-2.5 rounded-sm ${invoiceDetails.can_reverse && 'bg-primary'}`}
                                                    ></span>
                                                </div>
                                            </div>
                                            Tax Is Payable On Reverse Charge
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <label className="mb-2.5 block text-black dark:text-white text-center">
                                        Recipient State Details
                                        <div className="w-full my-2">
                                            <SelectState invoiceDetails={invoiceDetails} setinvoiceDetails={setinvoiceDetails} type={'recipient_gst_state'} />
                                        </div>
                                    </label>

                                    <div className="w-full xl:w-1/2">
                                        <input
                                            type="text"
                                            placeholder="State"
                                            value={invoiceDetails.recipient_gst_state}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => { setinvoiceDetails({ ...invoiceDetails, recipient_gst_state: e.target.value }) }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="State Code"
                                            value={invoiceDetails.recipient_gst_statecode}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => { setinvoiceDetails({ ...invoiceDetails, recipient_gst_statecode: e.target.value }) }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <label className="mb-2.5 block text-black dark:text-white text-center">
                                        Place Of Supply Details
                                        <div className="w-full my-2">
                                            <SelectState invoiceDetails={invoiceDetails} setinvoiceDetails={setinvoiceDetails} type={'place_of_supply_gst_state'} />
                                        </div>
                                    </label>

                                    <div className="w-full xl:w-1/2">
                                        <input
                                            type="text"
                                            placeholder="State"
                                            value={invoiceDetails.place_of_supply_gst_state}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => { setinvoiceDetails({ ...invoiceDetails, place_of_supply_gst_state: e.target.value }) }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="State Code"
                                            value={invoiceDetails.place_of_supply_gst_statecode}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => { setinvoiceDetails({ ...invoiceDetails, place_of_supply_gst_statecode: e.target.value }) }}
                                        />
                                    </div>
                                </div>
                                <div className='flex justify-center items-center mb-4.5 flex-col'>
                                    {selectedProducts.map((p, index) => <h3 className='text-lg mb-2 text-center' >( {index + 1} ) {p.quantity} {p.name} @ Rs {p.rate} ({p.gst}% GST)</h3>)}
                                    <button className="flex w-1/2 justify-center rounded bg-green-400 p-3 font-medium text-gray hover:bg-opacity-90" onClick={(e) => { e.preventDefault(); setShowModal(true) }}>
                                        Add Products
                                    </button>
                                </div>

                                <div className='flex justify-end w-full my-2'>
                                    <label
                                        htmlFor="checkboxLabelTwo"
                                        className="flex cursor-pointer select-none items-center"
                                    >
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                id="checkboxLabelTwo"
                                                className="sr-only"
                                                onChange={() => { setinvoiceDetails({ ...invoiceDetails, isIGST: !invoiceDetails.isIGST }) }}
                                            />
                                            <div
                                                className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${invoiceDetails.isIGST && 'border-primary bg-gray dark:bg-transparent'
                                                    }`}
                                            >
                                                <span
                                                    className={`h-2.5 w-2.5 rounded-sm ${invoiceDetails.isIGST && 'bg-primary'}`}
                                                ></span>
                                            </div>
                                        </div>
                                        Tax Type is IGST
                                    </label>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row items-center">
                                    <div className="w-full xl:w-1/2">
                                        <p>Shipping/Packaging Charges</p>
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <input
                                            type="text"
                                            placeholder="Shipping/Packaging Charges"
                                            value={invoiceDetails.packaging}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            onChange={(e) => { setinvoiceDetails({ ...invoiceDetails, packaging: e.target.value }) }}
                                        />
                                    </div>
                                </div>

                                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={handleGeneratePDF}>
                                    Generate invoice
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
                            <button className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={() => { viewLiveInvoice(invoiceDetails, selectedProducts) }}>
                                Regenerate Preview
                            </button>
                        </div>
                        <div id="invoiceIframeContainer"></div>
                    </div>
                </div>
            </div >
        </DefaultLayout >
    );
};

export default NewInvoice;
