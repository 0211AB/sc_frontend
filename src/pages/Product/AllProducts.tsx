import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';

import { Product } from '../../types/product';
import { useContext, useEffect, useState } from 'react';
import MultiSelectCategory from '../../components/Forms/MultiSelectCategory';
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from '../../store/AuthContext';
import Loader from '../../common/Loader';
import { useNavigate } from 'react-router-dom';
import defaultProduct from '../../images/default-product-image.png'


interface TableProps {
    products: Product[]
}

const Table: React.FC<TableProps> = ({ products }) => {
    const navigate = useNavigate()
    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Products
                </h4>
                {products.length > 0 && <h4>Select A Product To View Details</h4>}
            </div>

            <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-2 flex items-center sm:col-span-2">
                    <p className="font-medium">Product Name</p>
                </div>
                <div className="col-span-2 items-center sm:flex">
                    <p className="font-medium ">Company</p>
                </div>
                <div className="col-span-2 items-center sm:flex">
                    <p className="font-medium ">Categories</p>
                </div>
                <div className="col-span-2 hidden sm:flex items-center">
                    <p className="font-medium ">Description</p>
                </div>
            </div>

            {products.length === 0 && <div className='flex justify-center items-center m-5'>No Products Found With Matching Filter(s)</div>}
            {products.map((product, key) => (
                <div
                    className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 cursor-pointer hover:shadow-default"
                    key={key}
                    onClick={() => { navigate(`/product/detail/${product._id}`) }}
                >
                    <div className="col-span-2 flex items-center">
                        <div className="flex flex-col gap-4 sm:flex-row items-center">
                            <div className="h-12.5 w-15 rounded-md">
                                <img src={product.image} alt="Product" onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = defaultProduct;
                                }} className='object-cover h-full'/>
                            </div>
                            <p className="text-sm text-black dark:text-white">
                                {product.name}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p className="text-sm text-black dark:text-white">
                            {product.company}
                        </p>
                    </div>
                    <div className="col-span-2 items-center sm:flex">
                        <div className="text-sm text-black dark:text-white flex flex-wrap items-justify gap-2">
                            {product.category.map((c) => (
                                <div className='border-primary border-2 capitalize p-1 rounded-md'>{c} </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-2 hidden sm:flex items-center">
                        <p className="text-sm text-black dark:text-white capitalize">{product.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};


const AllProducts = () => {
    const authCtx = useContext(AuthContext)
    const [products, setProducts] = useState<Product[]>([])
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [name, setName] = useState<string>('')
    const [company, setCompany] = useState<string>('')
    const [page, setPage] = useState(0)
    const [totalProducts, setTotalProducts] = useState(0)

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            let queryString = `?page=${page}`;
            if (name !== '') queryString += `&name=${name}`;
            if (company !== '') queryString += `&company=${company}`;
            if (selectedCategories.length > 0) {
                queryString += `&selectedCategories=${selectedCategories.join(',')}`;
            }
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/product/all${queryString}`, {
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
                    setProducts(res_data.products)
                    setTotalProducts(res_data.totalCount)
                }
            } catch (e: any) {
                toast.error(e.message);
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [selectedCategories, name, company, page])

    return (
        <DefaultLayout>
            <Breadcrumb pageName="All Products" />
            <Toaster />
            <div className="flex flex-col gap-9 mb-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark relative cursor-pointer" onClick={() => { setShowFilters(!showFilters) }}>
                        <svg className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${showFilters ? 'rotate-180' : ''}`} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" >
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z" fill=""></path>
                        </svg>
                        <h3 className="font-medium text-black dark:text-white">
                            Filters
                        </h3>
                    </div>
                    <div className={`flex flex-col gap-5.5 p-6.5 ${showFilters ? '' : 'hidden'}`}>
                        <div className="flex flex-col gap-5.5 sm:flex-row">
                            <div className="w-full sm:w-1/3">
                                <label
                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    htmlFor="name"
                                >
                                    Name
                                </label>
                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={name}
                                    placeholder="Enter Product Name"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="w-full sm:w-1/3">
                                <label
                                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                                    htmlFor="company"
                                >
                                    Company
                                </label>
                                <input
                                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="text"
                                    name="company"
                                    id="company"
                                    value={company}
                                    placeholder="Enter Company"
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </div>
                            <MultiSelectCategory id="category" setSelectedCategories={setSelectedCategories} />
                        </div>
                        <div className="flex gap-5.5 sm:flex-row justify-end">
                            <div className="flex justify-end gap-4.5">
                                <button
                                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                    type="submit"
                                    onClick={(e) => { e.preventDefault(); setCompany(''); setName(''); setSelectedCategories([]) }}
                                >
                                    Clear Filters
                                </button>
                                <button
                                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                    type="submit"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-10">
                {loading === true ? <div className='h-90'><Loader height='full'></Loader></div> : <Table products={products} />}
                {(totalProducts / 15) >= 1 && <div className="flex flex-col gap-9 mb-10">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark relative cursor-pointer flex flex-wrap gap-2 justify-center">
                            {Array.from({ length: Math.ceil(totalProducts / 15) }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setPage(index)}
                                    disabled={index === page}
                                    className={`w-7 h-8 border-primary border-2 cursor-pointer rounded-sm ${page === index ? 'bg-primary text-white' : 'text-primary'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>}
            </div>
        </DefaultLayout>
    );
};

export default AllProducts;
