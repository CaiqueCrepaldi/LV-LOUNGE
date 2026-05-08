import { useState } from 'react';

export function useConfirm() {
  const [state, setState] = useState<{
    message: string;
    resolve: (v: boolean) => void;
  } | null>(null);

  const confirm = (message: string): Promise<boolean> =>
    new Promise(resolve => setState({ message, resolve }));

  const handle = (v: boolean) => { state?.resolve(v); setState(null); };

  const modal = state ? (
    <div className="modal-backdrop" onClick={() => handle(false)}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-message">{state.message}</div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => handle(false)}>Cancelar</button>
          <button className="btn btn-danger btn-sm" onClick={() => handle(true)}>Confirmar</button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, modal };
}
