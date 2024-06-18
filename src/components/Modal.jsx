import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Modal = ({ setShowModal, products, selectedProducts, setSelectedProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (product) => {
    if (!selectedProducts.find(p => p._id === product._id)) {
      setSelectedProducts([...selectedProducts, product]);
      setSearchTerm('')
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p._id !== productId));
  };

  const handleConfirm = () => {
    let handlingErrors = false;
    selectedProducts.forEach((product) => {
      if (product.gst === '' || product.gst === undefined || product.gst === null) {
        toast.error(`GST For ${product.name} is required`);
        handlingErrors = true;
        return;
      }

      if (product.quantity === '' || product.quantity === undefined || product.quantity === null) {
        toast.error(`Quantity For ${product.name} is required`);
        handlingErrors = true;
        return;
      }

      if (product.rate === '' || product.rate === undefined || product.rate === null) {
        toast.error(`Rate For ${product.name} is required`);
        handlingErrors = true;
        return;
      }
    });

    if (handlingErrors === false) {
      setSelectedProducts(selectedProducts.filter(product => product.gst !== '' && product.gst !== undefined && product.gst !== null && product.quantity !== '' && product.quantity !== undefined && product.quantity !== null && product.rate !== '' && product.rate !== undefined && product.rate !== null))
      setShowModal(false);
    }
  };

  return (
    <div className="relative z-[999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <Toaster />
      <div className="fixed inset-0 bg-gray bg-opacity-95 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-full">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
              <div className="sm:flex sm:items-start w-full">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 w-full">
                  <h3 className="text-large font-semibold leading-6 text-gray-900 text-center" id="modal-title">Add Items To Quotation</h3>
                </div>
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Search products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="mt-4 overflow-y-auto">
                {searchTerm !== "" && filteredProducts.map(product => (
                  <div key={product._id} className="flex justify-between items-center border-b py-2 border-dashed">
                    <span>{product.name}</span>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => handleAddProduct(product)}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h4 className="font-medium">Selected Products</h4>
                {selectedProducts.map((product, index) => (
                  <div key={product._id} className={`flex items-center flex-col justify-center mt-2 lg:flex-row gap-2 pb-3 ${index === selectedProducts.length - 1 ? '' : 'border-b'}`} >
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-lg text-black break-all">{product.name}</p>
                      <p className="text-sm text-gray-500">Cost Price: {product.cost_price}</p>
                      <p className="text-sm text-gray-500">{product.cost_price_inclusive_tax ? '(Including Taxes)' : '(Excluding Taxes)'}</p>
                      <button
                        type="button"
                        className="ml-2 text-sm text-red-500 hover:underline"
                        onClick={() => handleRemoveProduct(product._id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center flex-row flex-wrap w-3/4">
                      <div className="flex justify-evenly">
                        <div className="flex flex-col items-center justify-between w-2/5">
                          Quantity
                          <input
                            type="number"
                            placeholder="Quantity"
                            className="p-1 border border-gray-300 rounded-md w-full"
                            value={product.quantity}
                            onChange={(e) => {
                              setSelectedProducts(prevProducts =>
                                prevProducts.map(p =>
                                  product._id === p._id ? { ...p, quantity: e.target.value } : p
                                )
                              );
                            }}
                            min="1"
                          />
                        </div>
                        <div className="flex items-center justify-between flex-col w-2/5">
                          Tax Rate (%)
                          <input
                            type="number"
                            placeholder="Tax Rate"
                            className="p-1 border border-gray-300 rounded-md w-full"
                            value={product.gst}
                            onChange={(e) => {
                              setSelectedProducts(prevProducts =>
                                prevProducts.map(p =>
                                  product._id === p._id ? { ...p, gst: e.target.value } : p
                                )
                              );
                            }}
                            min="1"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-evenly">
                        <div className="flex items-center justify-between flex-col w-2/5">
                          Rate
                          <input
                            type="number"
                            placeholder="Rate"
                            className="p-1 border border-gray-300 rounded-md w-full"
                            value={product.rate}
                            onChange={(e) => {
                              setSelectedProducts(prevProducts =>
                                prevProducts.map(p =>
                                  product._id === p._id ? { ...p, rate: e.target.value } : p
                                )
                              );
                            }}
                            min="1"
                          />
                        </div>
                        <div className="flex items-center justify-between flex-col w-2/5">
                          HSN Code
                          <input
                            type="number"
                            placeholder="HSN Code"
                            className="p-1 border border-gray-300 rounded-md w-full"
                            value={product.hsn_code}
                            onChange={(e) => {
                              setSelectedProducts(prevProducts =>
                                prevProducts.map(p =>
                                  product._id === p._id ? { ...p, hsn_code: e.target.value } : p
                                )
                              );
                            }}
                            min="1"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button type="button" className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto" onClick={handleConfirm}>Confirm</button>
              <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={() => { setShowModal(false); setSelectedProducts(selectedProducts.filter(product => product.gst !== '' && product.gst !== undefined && product.gst !== null && product.quantity !== '' && product.quantity !== undefined && product.quantity !== null && product.rate !== '' && product.rate !== undefined && product.rate !== null)) }}>Cancel</button>
            </div>
          </div>
        </div >
      </div >
    </div >
  )
}

export default Modal
