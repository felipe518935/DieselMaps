package co.edu.unipiloto.diesel_maps;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import androidx.appcompat.app.AppCompatActivity;

public class EstacionesActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_estaciones);

        ListView lista = findViewById(R.id.listaEstaciones);

        String[] estaciones = {
                "Estación Central - $13.900",
                "Estación Norte - $14.200"
        };

        ArrayAdapter<String> adapter = new ArrayAdapter<>(
                this,
                android.R.layout.simple_list_item_1,
                estaciones
        );

        lista.setAdapter(adapter);

        lista.setOnItemClickListener((parent, view, position, id) -> {
            Intent i = new Intent(this, DetalleActivity.class);
            i.putExtra("estacion", estaciones[position]);
            startActivity(i);
        });
    }
}