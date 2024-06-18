import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';

const NewChallan: React.FC = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="NewChallan" />
        </DefaultLayout>
    );
};

export default NewChallan;
