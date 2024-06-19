import React, { useContext, useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import AuthContext from '../../store/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../../common/Loader';
import { createQuotation, viewinTab } from '../../utils/quotation'
import { useNavigate } from 'react-router-dom';

const QuotationsTable = () => {
  const authCtx = useContext(AuthContext)
  const navigate = useNavigate()
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false);
  const [company, setCompany] = useState('')
  const [page, setPage] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let queryString = `?page=${page}`;
        if (company !== '') queryString += `&company=${company}`;

        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/quotation/all${queryString}`, {
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
          setQuotations(res_data.quotation)
          setTotalProducts(res_data.totalCount)
        }
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
    // eslint-disable-next-line
  }, [company, page,])
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <Toaster />
        <div className="flex flex-col gap-9 mb-10">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark relative cursor-pointer" onClick={() => { setShowFilters(!showFilters) }}>
              <svg className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${showFilters ? 'rotate-180' : ''}`} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" >
                <path fillRule="evenodd" clipRule="evenodd" d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z" fill=""></path>
              </svg>
              <h3 className="font-medium text-black dark:text-white">
                Filters
              </h3>
            </div>
            <div className={`flex flex-col p-6.5 ${showFilters ? '' : 'hidden'}`}>
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/3">
                  <label
                    className="mb-2 block text-sm font-medium text-black dark:text-white"
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
              </div>
              <div className="flex gap-5.5 sm:flex-row justify-end">
                <div className="flex justify-end gap-4.5">
                  <button
                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    type="submit"
                    onClick={(e) => { e.preventDefault(); setCompany(''); }}
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
        {loading === true ? <div className='h-50 flex justify-center items-center'><Loader height='30' /></div> : <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Company
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Subject
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Date
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((item, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {item.company}
                  </h5>
                  <p className="text-sm">{item.address_line_1} </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {item.subject}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium`} >
                    {item.date}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary flex flex-col justify-center items-center" onClick={() => { navigate(`/quotations/edit/${item?._id}`) }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" className="fill-current"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="edit"> <g> <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path> <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></polygon> </g> </g> </g> </g></svg>
                      <p className='text-xs mt-1'>Edit</p>
                    </button>

                    <button className="hover:text-primary flex flex-col justify-center items-center" onClick={() => { viewinTab(item, item.items) }}>
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                          fill=""
                        />
                        <path
                          d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                          fill=""
                        />
                      </svg>
                      <p className='text-xs mt-1'>View</p>
                    </button>
                    <button className="hover:text-primary flex flex-col justify-center items-center" onClick={() => { createQuotation(item, item.items) }}>
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                          fill=""
                        />
                        <path
                          d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                          fill=""
                        />
                      </svg>
                      <p className='text-xs mt-1'>Download</p>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
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
    </div>
  );
};


const Quotation = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Quotations" />
      <QuotationsTable />
    </DefaultLayout>
  );
};

export default Quotation;
