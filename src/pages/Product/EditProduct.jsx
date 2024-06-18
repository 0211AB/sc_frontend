import { useContext, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import MultiSelect from '../../components/Forms/MultiSelectColor';
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from '../../store/AuthContext';
import Loader from '../../common/Loader';
import { useNavigate, useParams } from 'react-router-dom';


const MultiSelectCategory = ({ id, setSelectedCategories, initiallySelectedCategories }) => {
    const authCtx = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [show, setShow] = useState(false);
    const [filter, setFilter] = useState('');
    const dropdownRef = useRef(null);
    const trigger = useRef(null);

    useEffect(() => {
        const newSelected= [];
        const newOptions = [];
        for (let i = 0; i < options.length; i++) {
            if (initiallySelectedCategories.includes(options[i].value)) {
                newSelected.push(i)
                newOptions.push({ ...options[i], selected: true })
            } else
                newOptions.push(options[i])
        }
        setSelected(newSelected)
        setOptions(newOptions)
        // eslint-disable-next-line
    }, [initiallySelectedCategories])

    useEffect(() => {
        const getAllData = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/category/all`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer :${authCtx.token}`
                    },
                });

                const res_data = await res.json();
                if (res.status !== 200) {
                    toast.error(res_data.message);
                    setLoading(false);
                } else {
                    const newOptions = [];
                    for (let i = 0; i < res_data.length; i++) {
                        newOptions.push({
                            value: res_data[i]._id,
                            text: res_data[i].name,
                            selected: false,
                        });
                    }
                    setOptions(newOptions);
                    setCategories(res_data);
                    setLoading(false);
                }
            } catch (e) {
                toast.error(e.message);
                setLoading(false);
            }
        }

        if (loading) getAllData();
        // eslint-disable-next-line
    }, [loading]);

    useEffect(() => {
        setSelectedCategories(selectedValues());
        // eslint-disable-next-line
    }, [selected]);

    const open = () => {
        setShow(!show);
    };


    const isOpen = () => {
        return show === true;
    };

    const select = (id) => {
        const newOptions = [...options];
        if (newOptions.find((option) => option.value === id)?.selected === true) {
            setOptions(newOptions.map((option, index) => {
                if (option.value === id) {
                    setSelected(selected.filter((i) => i !== index));
                    option.selected = false;
                    return option;
                }
                return option;
            }))
        } else {
            setOptions(newOptions.map((option, index) => {
                if (option.value === id) {
                    setSelected([...selected, index]);
                    option.selected = true;
                    return option;
                }
                return option;
            }))
        }
    };

    const remove = (index) => {
        const newOptions = [...options];
        const selectedIndex = selected.indexOf(index);

        if (selectedIndex !== -1) {
            newOptions[index].selected = false;
            setSelected(selected.filter((i) => i !== index));
            setOptions(newOptions);
        }
    };

    const selectedValues = () => {
        return selected.map((option) => options[option].value);
    };

    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdownRef.current) return;
            if (
                !show ||
                dropdownRef.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setShow(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    const filteredOptions = options.filter(option =>
        option.text.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="relative z-[51]">
            <Toaster />
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Categories
            </label>
            <div>
                <select className="hidden" id={id}>
                    {categories.map((category) => {
                        return <option value={category._id} key={category._id}>{category.name}</option>
                    })}
                </select>
                <div className="flex flex-col items-center">
                    <input name="values" type="hidden" value={selectedValues().join(',')} />
                    <div className="relative z-20 inline-block w-full">
                        <div className="relative flex flex-col items-center">
                            <div ref={trigger} onClick={open} className="w-full">
                                {loading === true ? <div className='m-2'><Loader height='10' /></div> : <><div className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                    <div className="flex flex-auto flex-wrap gap-3">
                                        <div className="flex-1">
                                            <input
                                                placeholder="Select an option"
                                                className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                                                value={filter}
                                                onChange={(e) => setFilter(e.target.value)}
                                            />
                                        </div>
                                        {selected.map((index) => (
                                            <div
                                                key={index}
                                                className="my-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30 capitalize"
                                            >
                                                <div className="max-w-full flex justify-between items-center gap-2">
                                                    {options[index].text}
                                                </div>
                                                <div className="flex flex-auto flex-row-reverse">
                                                    <div
                                                        onClick={() => remove(index)}
                                                        className="cursor-pointer pl-2 hover:text-danger"
                                                    >
                                                        <svg
                                                            className="fill-current"
                                                            role="button"
                                                            width="12"
                                                            height="12"
                                                            viewBox="0 0 12 12"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                                                                fill="currentColor"
                                                            ></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex w-8 items-center py-1 pl-1 pr-1">
                                        <button
                                            type="button"
                                            onClick={open}
                                            className="h-6 w-6 cursor-pointer outline-none focus:outline-none"
                                        >
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
                                        </button>
                                    </div>
                                </div></>}

                            </div>
                            <div className="w-full px-4">
                                <div
                                    className={`max-h-select absolute top-full left-0 z-40 w-full overflow-y-auto rounded bg-white shadow dark:bg-form-input ${isOpen() ? '' : 'hidden'
                                        }`}
                                    ref={dropdownRef}
                                    onClick={() => setShow(!show)}
                                >
                                    <div className="flex w-full flex-col">
                                        {filteredOptions.map((option, index) => (
                                            <div key={index}>
                                                <div
                                                    className="w-full cursor-pointer rounded-t border-b border-stroke hover:bg-primary/5 dark:border-form-strokedark capitalize"
                                                    onClick={() => select(option.value)}
                                                >
                                                    <div
                                                        className={`relative flex w-full items-center border-l-2 border-transparent p-2 pl-2 ${option.selected ? 'border-primary' : ''
                                                            }`}
                                                    >
                                                        <div className="flex w-full items-center">
                                                            <div className="mx-2 leading-6">
                                                                {option.text}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const EditProduct = () => {
    const { id } = useParams()
    const authCtx = useContext(AuthContext)
    const navigate = useNavigate()
    const formRef = useRef(null);
    const [isChecked, setIsChecked] = useState(true);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [initialCategories, setInitialCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedColors, setSelectedColors] = useState([])

    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result // Type assertion to string
                setImages((prevImages) => [...prevImages, base64String]);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/product/one/${id}`, {
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
                    if (formRef.current) {
                        (formRef.current.elements.namedItem('name')).value = res_data.name;
                        (formRef.current.elements.namedItem('company')).value = res_data.company;
                        (formRef.current.elements.namedItem('cost')).value = res_data.cost_price;
                        setIsChecked(res_data.cost_price_inclusive_tax);
                        (formRef.current.elements.namedItem('materials')).value = res_data.materials.join(",");
                        (formRef.current.elements.namedItem('description')).value = res_data.description;
                        (formRef.current.elements.namedItem('gst')).value = res_data.gst;
                        (formRef.current.elements.namedItem('hsn')).value = res_data.hsn_code;
                        setImages(res_data.images)
                        setSelectedColors(res_data.colors)
                        setInitialCategories(res_data.category.map((c) => c._id))
                    }
                }
            } catch (e) {
                toast.error(e.message);
            } finally {
            }
        }

        fetchProducts()
        // eslint-disable-next-line
    }, [])

    const submitHandler = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const name = data.get('name')
        const company = data.get('company')
        const cost = data.get('cost')
        const materials = data.get('materials')
        const description = data.get('description')
        const gst = data.get('gst')
        const hsn = data.get('hsn')

        if (!name) {
            toast.error('Product Name is required');
            return;
        }

        if (!cost) {
            toast.error('Product Cost Price is required');
            return;
        }

        setLoading(true);
        try {
            const body = {};

            if (name) body.name = name;
            if (company) body.company = company;
            if (cost) body.cost_price = cost;
            if (materials) body.materials = materials.split(",");
            if (description) body.description = description;
            if (gst) body.gst = gst;
            if (hsn) body.hsn_code = hsn;
            body.cost_price_inclusive_tax = isChecked
            body.category = selectedCategories;
            body.colors = selectedColors;
            body.images = images;

            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/product/edit/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer :${authCtx.token}`
                },
                body: JSON.stringify(body)
            });

            const res_data = await res.json();
            if (res.status !== 200) {
                toast.error(res_data.message);
            } else {
                toast.success(`Product updated successfully`);
                setLoading(true);
            }
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
            setTimeout(() => { navigate('/products/all') }, 2000)
        }
    }

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-270">
                <Toaster />
                <Breadcrumb pageName="Edit Product" />

                {loading === true ? <Loader height='screen'></Loader> : <div className="grid grid-cols-5 gap-8">
                    <div className="col-span-5 xl:col-span-3">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">
                                    Product Information
                                </h3>
                            </div>
                            <div className="p-7">
                                <form onSubmit={submitHandler} ref={formRef}>
                                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                        <div className="w-full sm:w-1/2">
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
                                                placeholder="Eg: Polo T-Shirt Round Neck XL"
                                            />
                                        </div>

                                        <div className="w-full sm:w-1/2">
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
                                            />
                                        </div>
                                    </div>

                                    <MultiSelectCategory id="category" setSelectedCategories={setSelectedCategories} initiallySelectedCategories={initialCategories} />

                                    <div className="mb-5.5 mt-5">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white flex justify-between"
                                            htmlFor="cost"
                                        >
                                            Cost Price
                                            <label
                                                htmlFor="checkboxLabelTwo"
                                                className="flex cursor-pointer select-none items-center"
                                            >
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        id="checkboxLabelTwo"
                                                        className="sr-only"
                                                        onChange={() => {
                                                            setIsChecked(!isChecked);
                                                        }}
                                                    />
                                                    <div
                                                        className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${isChecked && 'border-primary bg-gray dark:bg-transparent'
                                                            }`}
                                                    >
                                                        <span className={`opacity-0 ${isChecked && '!opacity-100'}`}>
                                                            <svg
                                                                width="11"
                                                                height="8"
                                                                viewBox="0 0 11 8"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                                                    fill="#3056D3"
                                                                    stroke="#3056D3"
                                                                    strokeWidth="0.4"
                                                                ></path>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                                Tax Inclusive
                                            </label>
                                        </label>
                                        <input
                                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            type="number"
                                            name="cost"
                                            id="cost"
                                            placeholder="Cost price in INR"
                                        />
                                    </div>

                                    <div className="mb-5.5">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="materials"
                                        >
                                            Materials
                                        </label>
                                        <input
                                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            type="text"
                                            name="materials"
                                            id="materials"
                                            placeholder="Provide , seperated materials Eg: cotton,jute,silk"
                                        />
                                    </div>

                                    <MultiSelect id="colors" setSelectedColors={setSelectedColors} initiallySelectedColorsForEdit={selectedColors} />

                                    <div className="mb-5.5">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="description"
                                        >
                                            Description
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4.5 top-4">
                                                <svg
                                                    className="fill-current"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g opacity="0.8" clipPath="url(#clip0_88_10224)">
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M1.56524 3.23223C2.03408 2.76339 2.66997 2.5 3.33301 2.5H9.16634C9.62658 2.5 9.99967 2.8731 9.99967 3.33333C9.99967 3.79357 9.62658 4.16667 9.16634 4.16667H3.33301C3.11199 4.16667 2.90003 4.25446 2.74375 4.41074C2.58747 4.56702 2.49967 4.77899 2.49967 5V16.6667C2.49967 16.8877 2.58747 17.0996 2.74375 17.2559C2.90003 17.4122 3.11199 17.5 3.33301 17.5H14.9997C15.2207 17.5 15.4326 17.4122 15.5889 17.2559C15.7452 17.0996 15.833 16.8877 15.833 16.6667V10.8333C15.833 10.3731 16.2061 10 16.6663 10C17.1266 10 17.4997 10.3731 17.4997 10.8333V16.6667C17.4997 17.3297 17.2363 17.9656 16.7674 18.4344C16.2986 18.9033 15.6627 19.1667 14.9997 19.1667H3.33301C2.66997 19.1667 2.03408 18.9033 1.56524 18.4344C1.0964 17.9656 0.833008 17.3297 0.833008 16.6667V5C0.833008 4.33696 1.0964 3.70107 1.56524 3.23223Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 3.99402C17.5023 3.81878 17.6008 3.5811 17.6008 3.33328C17.6008 3.08545 17.5023 2.84777 17.3271 2.67253C17.1519 2.49729 16.9142 2.39884 16.6664 2.39884ZM14.8271 1.49402C15.3149 1.00622 15.9765 0.732178 16.6664 0.732178C17.3562 0.732178 18.0178 1.00622 18.5056 1.49402C18.9934 1.98182 19.2675 2.64342 19.2675 3.33328C19.2675 4.02313 18.9934 4.68473 18.5056 5.17253L10.5889 13.0892C10.4821 13.196 10.3483 13.2718 10.2018 13.3084L6.86847 14.1417C6.58449 14.2127 6.28409 14.1295 6.0771 13.9225C5.87012 13.7156 5.78691 13.4151 5.85791 13.1312L6.69124 9.79783C6.72787 9.65131 6.80364 9.51749 6.91044 9.41069L14.8271 1.49402Z"
                                                            fill=""
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_88_10224">
                                                            <rect width="20" height="20" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </span>

                                            <textarea
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                name="description"
                                                id="description"
                                                rows={6}
                                                placeholder="Write your description here"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                        <div className="w-full sm:w-1/2">
                                            <label
                                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                                htmlFor="gst"
                                            >
                                                GST
                                            </label>
                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="number"
                                                name="gst"
                                                id="gst"
                                                placeholder="GST %"
                                            />
                                        </div>
                                        <div className="w-full sm:w-1/2">
                                            <label
                                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                                htmlFor="hsn"
                                            >
                                                HSN Code
                                            </label>
                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="number"
                                                name="hsn"
                                                id="hsn"
                                                placeholder="HSN Code"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4.5">
                                        <button
                                            className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                            type="submit"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                            type="submit"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-5 xl:col-span-2">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">
                                    Product Photo(s)
                                </h3>
                            </div>
                            <div className="p-7">
                                <form action="#">

                                    <div className="mb-4 flex items-center justify-evenly gap-3 flex-wrap">
                                        {images.map((image, index) => {
                                            return <div className='flex flex-col justify-center items-center' key={index}>
                                                <div className="w-24 p-1">
                                                    <img src={image} alt={`product-${index}`} className='rounded border-slate-300 border-2' />
                                                </div>
                                                <div>
                                                    <span className="flex gap-2.5">
                                                        <button className="text-sm hover:text-primary" onClick={(e) => { e.preventDefault(); setImages((prevImages) => prevImages.filter((_, i) => i !== index)) }}>
                                                            Delete
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>
                                        })}
                                    </div>

                                    <div
                                        id="FileUpload"
                                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                            onChange={handleFileUpload}
                                        />
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                                        fill="#3C50E0"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                                        fill="#3C50E0"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                                        fill="#3C50E0"
                                                    />
                                                </svg>
                                            </span>
                                            <p>
                                                <span className="text-primary">Click to upload</span> or
                                                drag and drop
                                            </p>
                                            <p className="mt-1.5">SVG, PNG or JPG</p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </DefaultLayout>
    );
};

export default EditProduct;
