// @ts-nocheck
import React from 'https://esm.sh/react@18.2.0';
import { ImageResponse } from 'https://deno.land/x/og_edge@0.0.4/mod.ts';

export default async function handler(req: Request) {
  try {
    const url = new URL(req.url);
    const name = url.searchParams.get('name') || '';
    const profitPercent = url.searchParams.get('profitPercent') || 0;
    const entry = url.searchParams.get('entry') || '0';
    const profit = url.searchParams.get('profit') || '0';
    const purchaseDate = url.searchParams.get('purchaseDate') || '-';
    const soldDate = url.searchParams.get('soldDate') || '-';

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            backgroundColor: '#00D68F',
            width: '100%',
            height: '100%',
            color: '#fff',
            padding: '75px',
            fontFamily: 'Clash Display'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 96,
              fontWeight: 600,
              lineHeight: '120px'
            }}
          >
            <div>{name}</div>
            <div>
              {profitPercent > 0 ? `+${profitPercent}%` : `${profitPercent}%`}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Entry</span>
                <span>${entry}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Current profit</span>
                <span>
                  {profit >= 0 ? `$${profit}` : `-$${Math.abs(profit)}`}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Purchased</span>
                <span>{purchaseDate}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Sold</span>
                <span>{soldDate}</span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 750,
        height: 750
      }
    );
  } catch (error) {
    console.error('Error rendering image:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
