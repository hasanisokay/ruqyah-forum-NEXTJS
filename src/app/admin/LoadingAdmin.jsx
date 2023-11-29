import Image from 'next/image';
import spinner from "@/../public/images/spinner.gif"
const LoadingAdmin = () => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <p className='font-semibold text-lg'>Loading data. Please Wait...</p>
            <Image src={spinner} alt='Spinner' width={80} height={80} />
        </div>);
};

export default LoadingAdmin;