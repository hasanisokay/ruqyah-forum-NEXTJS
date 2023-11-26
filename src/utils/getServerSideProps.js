import { parse } from 'cookie';
import { jwtVerify } from 'jose';
import { COOKIE_NAME } from '@/constants';

export async function getServerSideProps(context) {
  const cookies = parse(context.req.headers.cookie || '');
  const token = cookies[COOKIE_NAME]?.split('Bearer')[1];

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

  try {
    const { payload } = await jwtVerify(token, secret);
    const { username, email, name, gender, phone, joined } = payload;

    return {
      props: { username, email, name, gender, phone, joined },
    };
  } catch (error) {
    console.error('JWT verification failed:', error.message);

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}
