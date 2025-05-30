import Breadcrumb from '@/Components/Breadcrumb';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, router } from '@inertiajs/react';

export default function ProductCreateEdit({ datas }) {
    const { data, setData, post, patch, errors, reset, processing, recentlySuccessful } =
        useForm({
            title: datas.title ? datas.title : '',
            price: datas.price ? datas.price : '',
            photo: datas.photo ? datas.photo : '',
        });

    const submit = (e) => {
        e.preventDefault();
        if (!datas.id) {
            post(route('product.store'), { preserveState: true }, {
                onFinish: () => {
                    reset();
                },
            });
        } else {
            handleUpdate(datas.id);
            // patch(route('product.update', datas.id), {
            //     onFinish: () => {
            //         reset();
            //     },
            // });
        }
    };

    const handleUpdate = (productId) => {
        const formData = new FormData();
        formData.append('title', data.title); // ensure string
        formData.append('price', data.price); // ensure string/number
        if (data.photo instanceof File) {
            formData.append('photo', data.photo);
        }
        formData.append('_method', 'patch'); // spoof PATCH method for Laravel
        console.log(formData, 'formData');
        
        router.post(route('product.update', productId), formData, {
            forceFormData: true, // important for file upload
            onSuccess: () => {
                // Optionally show success message
            },
        });
    };

    const headWeb = 'Product'
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];
    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />} >
            <Head title={headWeb} />
            <section className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-outline card-info">
                            <div className="card-header">
                                <h3 className="card-title">
                                    Register Data Management
                                </h3>
                            </div>
                            <form onSubmit={submit}>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label className='text-uppercase' htmlFor="title"><span className='text-danger'>*</span>Title</label>
                                        <input
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            type="text"
                                            name="title"
                                            className={`form-control ${errors.title && 'is-invalid'}`}
                                            id="title"
                                        />
                                        <InputError className="mt-2" message={errors.title} />
                                    </div>
                                    <div className="form-group">
                                        <label className='text-uppercase' htmlFor="price"><span className='text-danger'>*</span>Price</label>
                                        <input
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            type="number"
                                            name="price"
                                            className={`form-control ${errors.price && 'is-invalid'}`}
                                            id="price"
                                        />
                                        <InputError className="mt-2" message={errors.price} />
                                    </div>
                                    <div className="form-group">
                                        <label className='text-uppercase' htmlFor="photo"><span className='text-danger'>*</span>Photo</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setData('photo', e.target.files[0])}
                                            className="w-full border p-2 rounded"
                                        />
                                        <InputError className="mt-2" message={errors.photo} />
                                    </div>
                                </div>
                                <div className="card-footer clearfix">
                                    <button disabled={processing} type="submit" className="btn btn-primary">
                                        {processing ? datas?.id ? "Updating..." : "Saving..." : datas?.id ? "Update" : "Save"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}