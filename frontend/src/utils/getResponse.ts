import { NextResponse } from 'next/server';

export const errorMessageToRefreshToken = 'Unauthorized. Token is expired';

export const getResponseToRefreshToken = () =>
  NextResponse.json({ error: errorMessageToRefreshToken }, { status: 401 });
