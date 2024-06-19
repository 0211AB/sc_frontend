import React, { useContext, useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import './NewBrochure.css'
import AuthContext from '../../store/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import saraff_creations from '../../images/saraff_creations.png'
import thank_you from '../../images/ty.png'
import Loader from '../../common/Loader';

const NewBrochure = () => {
    const authCtx = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [clients, setClients] = useState([])
    const [selectedClient, setSelectedClient] = useState(null)
    const [selectedProducts, setSelectedProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(product =>
        product?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddProduct = (product) => {
        if (!selectedProducts.find(p => p._id === product?._id)) {
            setSelectedProducts([...selectedProducts, { ...product, sale_price_inclusive_tax: false }]);
            setSearchTerm('')
        }
    };

    const handleRemoveProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter(p => p._id !== productId));
    };

    const handlePrint = async (e)=> {
        e.preventDefault();

        if (selectedProducts.length === 0) {
            toast.error('Select Atleast 1 product');
            return;
        }

        const invalidProducts = selectedProducts.filter(product =>
            !product.sale_price || product.sale_price <= 0
        );

        if (invalidProducts.length > 0) {
            toast.error('All selected products must have a valid sale price.');
            return;
        }

        setLoading(true)

        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/brochure/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer :${authCtx.token}`
                },
                body: JSON.stringify(selectedClient ? { company: selectedClient._id, items: selectedProducts.map((p) => { return { productRef: p._id, sale_price: p.sale_price, sale_price_inclusive_tax: p.sale_price_inclusive_tax } }) } : { items: selectedProducts.map((p) => { return { productRef: p._id, sale_price: p.sale_price, sale_price_inclusive_tax: p.sale_price_inclusive_tax } }) })
            })

            const res_data = await res.json();
            if (res.status !== 201) {
                toast.error('Error saving brochure to backend');
            } else {
                toast.success(res_data.message)
            }
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false)
            const brochureElement = document.getElementById('brochure');
            if (!brochureElement) return;

            const printSection = brochureElement.cloneNode(true);

            const printFrame = document.createElement('iframe');
            printFrame.style.position = 'absolute';
            printFrame.style.width = '0px';
            printFrame.style.height = '0px';
            printFrame.style.border = 'none';

            document.body.appendChild(printFrame);

            const printDocument = printFrame.contentDocument;
            const printWindow = printFrame.contentWindow;

            if (printDocument && printWindow) {
                printDocument.open();
                printDocument.write(`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Print Preview</title>
                  <script src="https://cdn.tailwindcss.com"></script>
                  <style>
                  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    
                  * {
                        -webkit-print-color-adjust: exact !important;  
                        color-adjust: exact !important;                 
                        print-color-adjust: exact !important; 
                        font-family:'Poppins',serif;    
                    }
    
                    body, html {
                        margin: 0;
                        padding: 0;
                        background: #EFEFEC;
                    }
                    
                    .sc,.ty{
                        height:100vh !important;
                    }
    
                    @media print {
    
                    .sc,.ty{
                        height:100vh !important;
                    }
    
                    .product-container {
                       width:100vw;
                       height:98vh;
                       padding:0;
                       padding-top:1rem;
                       margin:0;
                       page-break-inside: avoid;
                       border:none;
                    }
                       
                    .image-container{
                        display:flex;
                        flex-wrap:wrap;
                        height:75%;
                        gap:0.5rem;
                    }
    
                    .image-container.one-image img{
                        height: 100%;
                        width: 100%;
                        object-fit:contain;
                    }
    
                    .image-container.two-images img{
                        height: 48%;
                        width:auto;
                        object-fit:contain;
                    }
    
                    .image-container.four-images img{
                        height: 48%;
                        width: 48%;
                        object-fit:contain;
                    }
    
                    .image-container.three-images img {
                        height: 48%; /* Allow images to scale proportionally */
                        width: 48%; /* Allow images to scale proportionally */
                        object-fit:contain;
                    }
    
                    @page{
                        size: auto;  
                        margin: 0mm;
                    }
                  </style>
                </head>
                <body>
                  ${printSection.innerHTML}
                </body>
                </html>
              `);
                printDocument.close();

                printWindow.onafterprint = () => {
                    document.body.removeChild(printFrame);
                };

                printWindow.focus();
                printWindow.print();
            } else {
                document.body.removeChild(printFrame);
            }

            setSelectedProducts([])
        }
    };


    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/product/all-nofilters`, {
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
            } catch (e) {
                toast.error(e.message);
            } finally {
                setLoading(false)
            }
        }

        const fetchClients = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/company/all`, {
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
            } catch (e) {
                toast.error(e.message);
            } finally {
                setLoading(false)
            }
        }


        if (loading === true) {
            fetchProducts()
            fetchClients()
        }

        // eslint-disable-next-line
    }, [])


    return (
        <DefaultLayout>
            <Breadcrumb pageName="New Brochure" />
            <Toaster />
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                {loading === true ? <Loader height='full' /> : <div className="flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Add Products
                            </h3>
                        </div>
                        <form>
                            <div className="p-6.5">
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Select Company
                                    </label>
                                    <select
                                        value={selectedClient ? clients[selectedClient]?.name : ""}
                                        onChange={(e) => {
                                            setSelectedClient(clients[Number(e.target.value)]);
                                        }}
                                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                                    >
                                        <option value="" disabled className="text-body dark:text-bodydark">
                                            Select A Company
                                        </option>
                                        {clients.map((c, index) => {
                                            return <option value={index} className="text-body dark:text-bodydark" key={index}>
                                                {c.name}
                                            </option>
                                        })}
                                    </select>
                                </div>
                                <div className="my-4 relative">
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Search products"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className='absolute z-[999] w-full'>
                                        {searchTerm !== "" && filteredProducts.map((product) => {
                                            return <div className="text-body dark:text-bodydark bg-white border-b-2 capitalize p-2 cursor-pointer" key={product?._id} onClick={() => handleAddProduct(product)}>{product?.name} {product?.company ? `( ${product?.company})` : ''}</div>
                                        })}
                                    </div>
                                </div>
                                {selectedProducts.length > 0 && <h2 className='text-lg text-primary font-bold'>Selected Products</h2>}
                                {selectedProducts.map((p) => {
                                    return <div key={p._id} className='flex justtify-between items-center my-4'>
                                        <div className='w-1/2 flex-wrap'>
                                            <p className='font-bolder'>{p?.name} {p?.company ? `( ${p?.company})` : ''}</p>
                                            <p className=''>COST PRICE: Rs {p.cost_price}</p>
                                        </div>
                                        <div className='flex w-1/2 flex-wrap justify-between'>
                                            <label className="flex items-center text-black dark:text-white gap-2 mb-1">
                                                Tax Included
                                                <div>
                                                    <label
                                                        htmlFor="toggle3"
                                                        className="flex cursor-pointer select-none items-center"
                                                    >
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                id="toggle3"
                                                                className="sr-only"
                                                                onChange={() => setSelectedProducts(prevProducts =>
                                                                    prevProducts.map(product =>
                                                                        product._id === p._id ? { ...product, sale_price_inclusive_tax: !p.sale_price_inclusive_tax } : product
                                                                    )
                                                                )}
                                                            />
                                                            <div className="block h-6 w-10 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                                                            <div
                                                                className={`dot absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${p.sale_price_inclusive_tax && '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                                                                    }`}
                                                            >
                                                                <span className={`hidden ${p.sale_price_inclusive_tax && '!block'}`}>
                                                                    <svg
                                                                        className="fill-white dark:fill-black"
                                                                        width="11"
                                                                        height="8"
                                                                        viewBox="0 0 11 8"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                                                            fill=""
                                                                            stroke=""
                                                                            strokeWidth="0.4"
                                                                        ></path>
                                                                    </svg>
                                                                </span>
                                                                <span className={`${p.sale_price_inclusive_tax && 'hidden'}`}>
                                                                    <svg
                                                                        className="h-4 w-4 stroke-current"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M6 18L18 6M6 6l12 12"
                                                                        ></path>
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>

                                            </label>
                                            <button className="hover:text-primary" onClick={() => { handleRemoveProduct(p._id) }}>
                                                <svg
                                                    className="fill-current"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </button>
                                            <input
                                                type="number"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                placeholder="Sale Price"
                                                value={p.sale_price}
                                                onChange={(e) => setSelectedProducts(prevProducts =>
                                                    prevProducts.map(product =>
                                                        product._id === p._id ? { ...product, sale_price: e.target.value } : product
                                                    )
                                                )}
                                            />
                                        </div>
                                    </div>
                                })}

                                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={handlePrint}>
                                    Generate Brochure
                                </button>
                            </div>
                        </form>
                    </div>
                </div>}

                <div className="flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between">
                            <h3 className="font-medium text-black dark:text-white">
                                Live Preview
                            </h3>
                        </div>
                        <div id='brochure'>
                            <img src={saraff_creations} alt="Start" className='sc h-1'></img>
                            {selectedProducts.map((product) => <div className="product-container container mx-auto  gap-0 m-4 border-b border-gray bg-[#EFEFEC] p-2">
                                <div className={`col-span-2 flex flex-wrap justify-center items-center m-3 image-container ${product?.images.length === 1 ? 'one-image' : product?.images.length === 2 ? 'two-images' : product?.images.length === 3 ? 'three-images' : 'four-images'} gap-2`}>
                                    {product?.images.map((image) => { return (<img src={image} alt="Product" className="rounded h-24 w-24" />) })}
                                </div>
                                <div className="content col-span-3 flex flex-col justify-center">
                                    <div className="nav flex justify-between items-center my-2 mx-5">
                                        <span className="logo uppercase text-[#524b41] font-bold">{product?.company}</span>
                                    </div>
                                    <div className="content-body flex w-full">
                                        <div className="black-label mx-5 grow-1 w-full">
                                            <span className="title text-5xl capitalize text-[#3F2D26]"><b>{product?.name}</b></span>
                                            <p className="text-s text-[#302715]">
                                                GST : {product?.gst ? product?.gst : '-'}%
                                            </p>
                                            <p className="text-s  text-[#302715]">
                                                HSN Code : {product?.hsn_code ? product?.hsn_code : '-'}
                                            </p>
                                            <div className="prix my-1 flex border-l-4 border-[#786363] gap-2">
                                                <span className="pl-2 text-[#786363]"><b>Offer Price : Rs {product?.sale_price} </b> </span>
                                                <span className="crt text-[#786363]">{product?.sale_price_inclusive_tax === undefined ? '' : product?.sale_price_inclusive_tax === true ? ' ( Taxes Included ) ' : ' ( + Tax ) '} </span>
                                            </div>
                                            {product?.colors && product?.colors.length > 0 && <div className="flex justify-end items-center gap-2">
                                                <h4 className="font-medium text-[#29251E] dark:text-white">
                                                    Available In
                                                </h4>
                                                <div className="flex items-center justify-center gap-3.5">
                                                    {product?.colors.map((c, idx) => {
                                                        return <div key={idx} style={{ background: c, height: '20px', width: '20px', borderRadius: '5px' }}></div>
                                                    })}
                                                </div>
                                            </div>}

                                            {product?.materials && product?.materials.length > 0 && <div className="flex justify-end gap-2">
                                                <h4 className="font-medium text-black dark:text-white text-[#29251E]">
                                                    Materials
                                                </h4>
                                                <div className="flex items-center justify-center gap-3.5 flex-wrap">
                                                    {product?.materials.map((m, index) => {
                                                        return <p className="hover:text-primary capitalize" aria-label="social-icon" key={index}> {m} </p>
                                                    })}
                                                </div>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                            <img src={thank_you} alt="Thank You" className='ty h-1'></img>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default NewBrochure;
