export const CrearTabla = (array) => 
{
    if(Array.isArray(array))
    {
        CargarSpinner();
        const tabla = document.createElement('tabla');
        tabla.appendChild(header(array[0]));
        tabla.appendChild(body(array));
        return tabla;
    }
}

function CargarSpinner()
{
    const div = document.getElementById('spinner');
    const tabla = document.getElementById('tTabla');
    tabla.style.display = 'none';
    div.style.display = 'block';
    setTimeout(() => {
        div.style.display = 'none';
        tabla.style.display = 'block';
    }, 2000);
}

const header = (elemento) => 
{
    const celdaHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');

    for(const i in elemento)
    {
        if(i != 'id')
        {
            const th = document.createElement('th');
            th.textContent = i;
            headerRow.appendChild(th);
        }
    }

    celdaHeader.appendChild(headerRow);

    return celdaHeader;
};

const body = (array) => 
{
    const row = document.createElement('tbody');
    array.forEach(element => 
    {
        const tr = document.createElement('tr');
        for(const i in element)
        {
            if(i === 'id')
            {
                tr.dataset.id = element[i];
            }
            else
            {
                const td = document.createElement('td');
                td.textContent = element[i];
    
                tr.appendChild(td);
            }
        }

        row.appendChild(tr);
    });

    return row;
};

export const ModificarTabla = (seccion, array) => 
{
    while(seccion.hasChildNodes())
    {
        seccion.removeChild(seccion.firstChild);
    }
    seccion.appendChild(CrearTabla(array));
}
