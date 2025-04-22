import { createFormAdd } from './form.add';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; //nameSpace for jest-dom matchers
import { vi } from 'vitest';

vi.spyOn(console, 'log');

describe('createFormAdd', () => {
    test('should create a form with the correct structure', async () => {
        // Act
        const form = createFormAdd([], 'body', 'afterbegin');

        // Assert
        expect(form).toBeInstanceOf(HTMLFormElement);

        const formElement = screen.getByRole('form', {
            name: 'add_form',
        }) as HTMLFormElement;
        expect(formElement).toBeInTheDocument();

        await userEvent.type(screen.getByLabelText('Name'), 'Nombre de prueba');
        await userEvent.type(
            screen.getByLabelText('Description'),
            'Descripción de prueba',
        );
        await userEvent.type(screen.getByLabelText('Price'), '1000');
        await userEvent.click(screen.getByLabelText('Esta en promoción'));
        await userEvent.selectOptions(
            screen.getByLabelText('Category'),
            'mobile',
        );
        const button = screen.getByRole('button', { name: 'Crear' });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('type', 'submit');
        button.click();

        expect(console.log).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Nombre de prueba',
                description: 'Descripción de prueba',
                price: 1000,
                hasPromo: true,
                category: 'mobile',
            }),
        );
    });
});
