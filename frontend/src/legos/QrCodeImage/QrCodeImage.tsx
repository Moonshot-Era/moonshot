import { FC } from 'react';
import QRCode from 'react-qr-code';

interface Props {
  value: string;
  maxWidth?: number;
}

export const QrCodeImage: FC<Props> = ({ value, maxWidth }) => {
  return (
    <div
      style={{
        height: 'auto',
        margin: '0 auto',
        maxWidth: maxWidth || 64,
        width: '100%',
      }}
    >
      <QRCode
        size={256}
        value={value}
        viewBox={`0 0 256 256`}
        style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
      />
    </div>
  );
};
