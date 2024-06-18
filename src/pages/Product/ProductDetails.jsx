import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { Carousel } from "@material-tailwind/react";
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from '../../store/AuthContext';
import Loader from '../../common/Loader';
import defaultProduct from '../../images/default-product-image.png'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const authCtx = useContext(AuthContext)
  const [details, setDetails] = useState(null)

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
          setDetails(res_data)
        }
      } catch (e) {
        toast.error(e.message);
      } finally {
      }
    }

    fetchProducts()
    // eslint-disable-next-line
  }, [])

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Product Details" />
      <Toaster />
      {details === null ? <Loader height='screen' /> : <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-50 md:h-90">
          <button className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-md z-30" onClick={() => { navigate(`/product/edit/${id}`) }}>
            Edit Product
          </button>
          <Carousel className="rounded-xl" autoplay loop>
            {details.images.map((img, index) => {
              return <img
                key={index}
                src={img}
                alt={`product ${index + 1}`}
                className="h-full w-full object-contain"
              />
            })}
            {details.images.length === 0 && <img src={defaultProduct}
              alt='default product'
              className="h-full w-full object-contain"
            />}
          </Carousel>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {details.name}
            </h3>
            {details.company && <p className="font-medium">{details.company}</p>}
            <div className="mx-auto mt-4.5 mb-5.5 grid max-w-150 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  Rs {details.cost_price}0000
                </span>
                <span className="text-sm">Cost Price</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  {details.gst ? details.gst : '-'} %
                </span>
                <span className="text-sm">GST</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  {details.hsn_code ? details.hsn_code : '-'}
                </span>
                <span className="text-sm">HSN Code</span>
              </div>
            </div>

            {details.description && <div className="mx-auto max-w-180">
              <h4 className="font-semibold text-black dark:text-white">
                Description
              </h4>
              <p className="mt-4.5">
                {details.description}
              </p>
            </div>}

            {details.category && details.category.length > 0 && <div className="mt-6.5">
              <h4 className="mb-3.5 font-medium text-black dark:text-white">
                Categories
              </h4>
              <div className="flex items-center justify-center gap-3.5">
                {details.category.map((c) => {
                  return <p className="hover:text-primary capitalize" aria-label="social-icon" key={c._id}>{c.name} </p>
                })}
              </div>
            </div>}

            {details.colors && details.colors.length > 0 && <div className="mt-6.5">
              <h4 className="mb-3.5 font-medium text-black dark:text-white">
                Colors
              </h4>
              <div className="flex items-center justify-center gap-3.5">
                {details.colors.map((c, idx) => {
                  return <div key={idx} style={{ background: c, height: '20px', width: '20px', borderRadius: '5px' }}></div>
                })}
              </div>
            </div>}

            {details.materials && details.materials.length > 0 && <div className="mt-6.5">
              <h4 className="mb-3.5 font-medium text-black dark:text-white">
                Materials
              </h4>
              <div className="flex items-center justify-center gap-3.5">
                {details.materials.map((m, index) => {
                  return <p className="hover:text-primary capitalize" aria-label="social-icon" key={index}> {m} </p>
                })}
              </div>
            </div>}
          </div>
        </div>
      </div>}
    </DefaultLayout>
  );
};

export default ProductDetails;
