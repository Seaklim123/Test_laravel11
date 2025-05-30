import React, { useState } from "react";
import { useForm, router, usePage, Head, Link } from "@inertiajs/react";
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';


export default function VerifyKey() {
    const { flash } = usePage().props;
    console.log(flash, 'flashss');

    const { data, setData, post, processing, errors } = useForm({
        key: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/telegram/verify'); // <- Correct usage of useForm
    };
    const headWeb = 'Verify Key'
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
                                    Datalist Management
                                </h3>
                                <div className="card-tools">
                                    <div className="input-group input-group-sm" style={{ width: '150px' }}>
                                        <input type="text" name="table_search" className="form-control float-right" placeholder="Search" />
                                        <div className="input-group-append">
                                            <button type="submit" className="btn btn-default">
                                                <i className="fas fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center bg-gray-100 p-5">
                                <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                                    <h2 className="text-2xl font-bold mb-4 text-center">Verify Telegram Key</h2>
                                    <form onSubmit={handleSubmit}>
                                        <input
                                            type="text"
                                            name="key"
                                            value={data.key}
                                            onChange={(e) => setData("key", e.target.value)}
                                            placeholder="Enter your Telegram key"
                                            className="w-full p-2 border rounded mb-2"
                                        />
                                        {errors.key && <div className="text-red-500 text-sm mb-2">{errors.key}</div>}

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                        >
                                            Verify
                                        </button>
                                    </form>

                                    {flash.success == "linked" && (
                                        <div className="mt-4 text-green-600 font-medium text-center">
                                            ✅ Telegram key has been linked with account already.
                                        </div>
                                    )}

                                    {flash.success == "user-updated" && (
                                        <div className="mt-4 text-green-600 font-medium text-center">
                                            ✅ Key saved to your account.
                                        </div>
                                    )}

                                    {flash.success == "invalid" && (
                                        <div className="mt-4 text-yellow-600 font-medium text-center">
                                            ⚠️ Key not found. Invalid Telegram auth.
                                        </div>
                                    )}
                                    <a href="https://t.me/attendance_sys_bot" target="_blank" 
                                        class="text-center">
                                        <span>Telegram Bot</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
