'use client';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Button } from "./Button";

interface ConfirmationModalProps{
    isOpen: boolean;
    onClose: ()=> void;
    onConfirm: ()=> void;
    title: string;
    confirmText: string;
    isLoading?:boolean;
    children?: React.ReactNode;
}

export const ConfirmationModal = ({
    isOpen,
    onClose,
    title,
    onConfirm,
    confirmText = "Confirm",
    isLoading = false,
    children
}: ConfirmationModalProps) =>{
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="absolute top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2" onClose={onClose}>
            <div className="fixed inset-0 bg-black-50" aria-hidden="true"></div>
                <TransitionChild 
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-200"
                    leaveTo="opacity-0"
                    >
                        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        {title}
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <div className="text-sm text-gray-500">{children}</div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <Button
                                    variant="primary" 
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="w-full sm:ml-3 sm:w-auto"
                                >
                                    {isLoading ? 'Processing...' : confirmText}
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={onClose}
                                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                </div>
                        </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    )
}