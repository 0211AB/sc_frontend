import { useContext, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import AuthContext from '../../store/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../../common/Loader';

const Category = () => {
    const authCtx = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createLoading, setCreateLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const formRef = useRef(null);

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

    const submitHandler = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const name = data.get('name')
        if (!name) {
            toast.error('Category Name is required');
            return;
        }

        setCreateLoading(true);
        try {
            const url = selectedCategory ?
                `${process.env.REACT_APP_BASE_URL}/category/update/${selectedCategory._id}` :
                `${process.env.REACT_APP_BASE_URL}/category/create`;
            const method = selectedCategory ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer :${authCtx.token}`
                },
                body: JSON.stringify({ name })
            });

            const res_data = await res.json();
            if (res.status !== 201) {
                toast.error(res_data.message);
            } else {
                toast.success(`Category ${selectedCategory ? 'updated' : 'added'} successfully`);
                setLoading(true);
                setSelectedCategory(null);
                formRef.current?.reset();
            }
        } catch (e) {
            toast.error(e.message);
        } finally {
            setCreateLoading(false);
        }
    }

    const deleteHandler = async () => {
        if (!selectedCategory) return;

        setCreateLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/category/delete/${selectedCategory._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer :${authCtx.token}`
                },
            });

            const res_data = await res.json();
            if (res.status !== 201) {
                toast.error(res_data.message);
            } else {
                toast.success('Category deleted successfully');
                setLoading(true);
                setSelectedCategory(null);
                formRef.current?.reset();
            }
        } catch (e) {
            toast.error(e.message);
        } finally {
            setCreateLoading(false);
        }
    }

    return (
        <DefaultLayout>
            <Toaster />
            <Breadcrumb pageName="Categories" />

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Existing Categories
                            </h3>
                            {categories.length > 0 && <h3>Select A Category To Update</h3>}
                        </div>

                        {loading ? (
                            <Loader height="50" />
                        ) : (
                            <div className="flex gap-2 flex-wrap p-5 md:p-2 xl:p-3 items-center justify-center">
                                {categories.length === 0 ? (
                                    <p>No Categories Found</p>
                                ) : (
                                    categories.map((category, index) => (
                                        <p
                                            onClick={() => { setSelectedCategory(category); formRef.current?.reset(); }}
                                            key={index}
                                            className={`inline-flex items-center justify-center rounded-md border border-${index % 3 === 0 ? 'primary' : index % 3 === 1 ? 'meta-3' : 'black'} py-4 px-6 text-center font-medium ${index % 3 === 0
                                                ? 'text-primary'
                                                : index % 3 === 1
                                                    ? 'text-meta-3'
                                                    : 'text-black'
                                                } hover:bg-opacity-90 lg:px-6 xl:px-6 capitalize cursor-pointer`}
                                        >
                                            {category.name}
                                        </p>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
                            <h3 className="font-medium text-black dark:text-white">
                                {selectedCategory === null ? 'Add New Category' : 'Update Category'}
                            </h3>
                            {selectedCategory && (
                                <h4 className='font-bold rounded-full h-8 w-8 border-primary border-2 flex justify-center items-center text-primary cursor-pointer' onClick={() => { setSelectedCategory(null); formRef.current?.reset(); }}>X</h4>
                            )}
                        </div>
                        <form ref={formRef} onSubmit={submitHandler}>
                            <div className="p-6.5">
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Name
                                    </label>
                                    <input
                                        name='name'
                                        type="text"
                                        defaultValue={selectedCategory?.name || ''}
                                        placeholder="Enter Name Of Category"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div className='flex justify-end gap-3'>
                                    <button
                                        className="flex w-1/3 justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                                        type="submit"
                                        disabled={createLoading}
                                    >
                                        {createLoading ? (selectedCategory ? 'Updating...' : 'Adding...') : (selectedCategory ? 'Update' : 'Add New')}
                                    </button>
                                    {selectedCategory && (
                                        <button
                                            className="flex w-1/3 justify-center rounded bg-red-500 p-3 font-medium text-gray hover:bg-opacity-90"
                                            type="button"
                                            onClick={deleteHandler}
                                            disabled={createLoading}
                                        >
                                            {createLoading ? 'Deleting...' : 'Delete'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Category;
