import { useContext, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import AuthContext from '../store/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../common/Loader';


const TableOne = ({ setSelectedBrand, clients }) => {
  return (
    <div className="h-screen rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 overflow-y-auto">
      <h4 className="mb-1 text-xl font-semibold text-black dark:text-white">
        All Clients
      </h4>
      {clients.length > 0 && <h4 className="mb-6 text-sm text-black dark:text-white">
        Select A Client To View Details
      </h4>}

      <div className="flex flex-col overflow-y-auto">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5 col-span-2">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Address
            </h5>
          </div>
          {/* <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Associated People
            </h5>
          </div> */}
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Email
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Phone
            </h5>
          </div>
        </div>

        {clients.map((brand, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${key === clients.length - 1
              ? ''
              : 'border-b border-stroke dark:border-strokedark'
              } cursor-pointer`}
            key={key}
            onClick={() => { setSelectedBrand(brand) }}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white sm:block">
                {brand.name}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5 col-span-2">
              <p className="text-black dark:text-white text-balanced">{
                (brand.address_line_1 ? brand.address_line_1 + " " : "") +
                (brand.address_line_2 ? brand.address_line_2 + " " : "") +
                (brand.address_line_3 ? brand.address_line_3 + " " : "") +
                (brand.address_line_4 ? brand.address_line_4 + " " : "")}</p>
            </div>


            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5 flex-wrap">
              <p className="text-black dark:text-white break-all">{brand.email ? brand.email : '-'}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5 break-all">{brand.phone ? brand.phone : '-'}</p>
            </div>
          </div>
        ))}

        {clients.length === 0 && <p className='text-center mt-4'>No Clients To Show</p>}
      </div>
    </div>
  );
};


const ClientList = ({ selectedBrand, setSelectedBrand }) => {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4 relative">
      <div className="absolute flex w-6 h-6 items-center justify-center rounded-full border-primary border-2 right-3 cursor-pointer" onClick={() => { setSelectedBrand(null) }}>
        <div className="text-sm font-bold text-primary">
          X
        </div>
      </div>
      <h4 className="mb-1 px-7.5 text-xl font-semibold text-black dark:text-white">
        {selectedBrand.name}
      </h4>
      <h4 className="mb-1 px-7.5 text-l font-semibold text-black dark:text-white"> {
        (selectedBrand.address_line_1 ? selectedBrand.address_line_1 + " " : "") +
        (selectedBrand.address_line_2 ? selectedBrand.address_line_2 + " " : "") +
        (selectedBrand.address_line_3 ? selectedBrand.address_line_3 + " " : "") +
        (selectedBrand.address_line_4 ? selectedBrand.address_line_4 + " " : "")}</h4>
      <h4 className="mb-1 px-7.5 text-l font-regular text-black dark:text-white"> {selectedBrand.phone}</h4>
      <h4 className="mb-6 px-7.5 text-l font-regular text-black dark:text-white"> {selectedBrand.email}</h4>

      <div>
        {selectedBrand.employees.length === 0 && <p className='text-center'>No employees associated with the client</p>}
        {selectedBrand.employees.map((chat, key) => (
          <div
            className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {chat.name}
                </h5>
                <p>
                  <div className="text-sm text-black dark:text-white">
                    {chat.phone}
                  </div>
                  <div className="text-xs">{chat.email}</div>
                </p>
              </div>
              <div className="flex items-center justify-center rounded-lg bg-primary p-1">
                <div className="text-sm font-medium text-white">
                  {chat.location}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const Clients = () => {
  const authCtx = useContext(AuthContext)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const createFormRef = useRef(null);
  const updateFormRef = useRef(null);
  const addFormRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
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

    if (loading === true)
      fetchProducts()
    // eslint-disable-next-line
  }, [loading])

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name')
    const address_line_1 = data.get('address_line_1')
    const address_line_2 = data.get('address_line_2')
    const address_line_3 = data.get('address_line_3')
    const address_line_4 = data.get('address_line_4')
    const gst = data.get('gst')
    const email = data.get('email')
    const phone = data.get('phone')

    if (!name) {
      toast.error('Client Name is required');
      return;
    }

    setLoading(true);
    try {
      const body = {};

      if (name) body.name = name;
      if (address_line_1) body.address_line_1 = address_line_1;
      if (address_line_2) body.address_line_2 = address_line_2;
      if (address_line_3) body.address_line_3 = address_line_3;
      if (address_line_4) body.address_line_4 = address_line_4;
      if (gst) body.gst_number = gst;
      if (email) body.email = email;
      if (phone) body.phone = phone

      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/company/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer :${authCtx.token}`
        },
        body: JSON.stringify(body)
      });

      const res_data = await res.json();
      if (res.status !== 201) {
        toast.error(res_data.message);
      } else {
        toast.success(`Client added successfully`);
        setLoading(true);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
      createFormRef.current?.reset()
    }
  }

  const updateHandler = async (e) => {
    e.preventDefault();

    if (!selectedBrand.name) {
      toast.error('Client Name is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/company/update/${selectedBrand._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer :${authCtx.token}`
        },
        body: JSON.stringify(selectedBrand)
      });

      const res_data = await res.json();
      if (res.status !== 201) {
        toast.error(res_data.message);
      } else {
        toast.success(`Client updated successfully`);
        setLoading(true);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
      setSelectedBrand(null)
      updateFormRef.current?.reset()
    }
  }

  const addEmployeeHandler = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name')
    const location = data.get('location')
    const email = data.get('email')
    const phone = data.get('phone')

    if (!name) {
      toast.error('Employee Name is required');
      return;
    }

    if (!location) {
      toast.error('Location is required');
      return;
    }

    setLoading(true);
    try {
      const body = {};

      if (name) body.name = name;
      if (location) body.location = location;
      if (email) body.email = email;
      if (phone) body.phone = phone

      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/company/addemployee/${selectedBrand._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer :${authCtx.token}`
        },
        body: JSON.stringify(body)
      });

      const res_data = await res.json();
      if (res.status !== 201) {
        toast.error(res_data.message);
      } else {
        toast.success(`Employee added successfully`);
        setLoading(false);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(true);
      setSelectedBrand(null)
      addFormRef.current?.reset()
    }
  }


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Clients" />
      <Toaster />
      <div className="h-full mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          {loading === true ? <Loader height='screen' /> : <TableOne setSelectedBrand={setSelectedBrand} clients={clients} />}
        </div>
        {selectedBrand !== null && <ClientList selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />}
        <div className={`h-full col-span-12 xl:${selectedBrand === null ? 'col-span-4' : 'col-span-12'} rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}>
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              {selectedBrand === null ? 'Add New' : 'Update'} Client
            </h3>
          </div>
          <div className='flex w-full flex-col sm:flex-col lg:flex-row'>
            {selectedBrand === null && <form className='grow-0 w-full' onSubmit={submitHandler} ref={createFormRef}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Name
                  </label>
                  <input
                    name='name'
                    type="text"
                    placeholder="Enter name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5 ">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    name='address_line_1'
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-1"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2"
                    name='address_line_2'
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-1"
                  />
                  <input
                    type="text"
                    name='address_line_3'
                    placeholder="Address Line 3"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-1"
                  />
                  <input
                    type="text"
                    name='address_line_4'
                    placeholder="Address Line 4"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-1"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    placeholder="GST Number"
                    name='gst'
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    name='email'
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name='phone'
                    placeholder="Enter phone number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  {selectedBrand === null ? 'Create New' : 'Update'}
                </button>
              </div>
            </form>}
            {selectedBrand !== null && <form className="grow-0 w-full md:w-1/2" onSubmit={updateHandler} ref={updateFormRef}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Name
                  </label>
                  <input
                    name='name'
                    type="text"
                    placeholder="Enter name"
                    value={selectedBrand.name}
                    onChange={(e) => { setSelectedBrand({ ...selectedBrand, name: e.target.value }) }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5 ">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    name='address_line_1'
                    value={selectedBrand.address_line_1}
                    onChange={(e) => { setSelectedBrand({ ...selectedBrand, address_line_1: e.target.value }) }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-1"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2"
                    name='address_line_2'
                    value={selectedBrand.address_line_2}
                    onChange={(e) => { setSelectedBrand({ ...selectedBrand, address_line_2: e.target.value }) }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-1"
                  />
                  <input
                    type="text"
                    name='address_line_3'
                    placeholder="Address Line 3"
                    value={selectedBrand.address_line_3}
                    onChange={(e) => { setSelectedBrand({ ...selectedBrand, address_line_3: e.target.value }) }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-1"
                  />
                  <input
                    type="text"
                    name='address_line_4'
                    placeholder="Address Line 4"
                    value={selectedBrand.address_line_4}
                    onChange={(e) => { setSelectedBrand({ ...selectedBrand, address_line_4: e.target.value }) }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-1"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    placeholder="GST Number"
                    name='gst'
                    value={selectedBrand.gst_number}
                    onChange={(e) => { setSelectedBrand({ ...selectedBrand, gst_number: e.target.value }) }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    name='email'
                    value={selectedBrand.email}
                    onChange={(e) => { setSelectedBrand({ ...selectedBrand, email: e.target.value }) }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name='phone'
                    value={selectedBrand.phone}
                    onChange={(e) => { setSelectedBrand({ ...selectedBrand, phone: e.target.value }) }}
                    placeholder="Enter phone number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  {selectedBrand === null ? 'Create New' : 'Update'}
                </button>
              </div>
            </form>}
            {selectedBrand !== null && <form className='grow' onSubmit={addEmployeeHandler} ref={addFormRef}>
              <h4 className="mb-1 px-6.5 py-2 text-xl font-semibold text-black dark:text-white text-center">Add New Member To The Existing Client</h4>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5 ">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Add New Connection
                </button>
              </div>
            </form>}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Clients;
