package com.tudou.army;

import java.io.*;
import java.util.*;
import java.util.regex.*;

import com.google.javascript.jscomp.CustomCompiler;

public class Builder {
	public static String SVNͷ = "\n * @url $URL$\n" +
			 " * @modified $Author$\n" +
			 " * @version $Rev$\n";
	public static String Ĭ��ͷע�� = "/**" + SVNͷ + " */";
	
	private String ��·��;
	private File ��ǰ�ļ�;
	private HashMap<String, Boolean> ȫ��ģ��;
	private HashMap<File, String> �ļ�ע��;
	private HashMap<File, String> �ļ�����;
	private HashMap<String, String> ģ��ID;
	
	public Builder(String ��·��, String ��ǰ�ļ�·��, HashMap<String, Boolean> ȫ��ģ��) {
		if(!��·��.endsWith(File.separator))
			��·�� += File.separator;
		this.��·�� = ��·��;
		��ǰ�ļ� = new File(��ǰ�ļ�·��);
		this.ȫ��ģ�� = ȫ��ģ��;
		�ļ�ע�� = new HashMap<File, String>();
		�ļ����� = new HashMap<File, String>();
		ģ��ID = new HashMap<String, String>();
	}
	
	public void ����() {
		LinkedHashSet<File> �ļ��б� = ȡ���ļ������б�(��ǰ�ļ�);
		�ļ��б�.add(��ǰ�ļ�);
		���(�ļ��б�);
	}
	
	private LinkedHashSet<File> ȡ���ļ������б�(File Ŀ���ļ�) {
		LinkedHashSet<File> �ļ��б� = new LinkedHashSet<File>();
		�ݹ�����ļ������ϵ(Ŀ���ļ�, �ļ��б�);
		return �ļ��б�;
	}
	private void �ݹ�����ļ������ϵ(File Ŀ���ļ�, LinkedHashSet<File> �ļ��б�) {
		String ���� = ��ȡ�ļ�����(Ŀ���ļ�);
		String ע�Ϳ�ͷ = ��ȡ�ļ�ע�Ϳ�ͷ(����);
		String ����ע�͵����� = ����.substring(ע�Ϳ�ͷ.length()).trim();
		LinkedHashSet<File> �����б� = ��ȡע�͵����ļ��б�(Ŀ���ļ�, ע�Ϳ�ͷ);
		LinkedHashSet<File> �����б� = ��ȡע�͹����ļ��б�(Ŀ���ļ�, ����ע�͵�����);
		LinkedHashSet<File> �����б� = ��ȡ�����ļ��б�(Ŀ���ļ�, ����ע�͵�����);
		�ļ�ע��.put(Ŀ���ļ�, ����ע�Ϳ�ͷ(ע�Ϳ�ͷ));
		�ļ�����.put(Ŀ���ļ�, ����ע�͵�����);
		String ID = ��ȡģ��ID(����ע�͵�����);
		ģ��ID.put(Ŀ���ļ�.getAbsolutePath(), ID);
		//������ȫ��ģ�飬��������ȫ��ģ��ᱻ����
		if(ID != null && ȫ��ģ��.containsKey(ID) && Ŀ���ļ� != ��ǰ�ļ�) {
			return;
		}
		String URI = ��ȡģ��URI(Ŀ���ļ�);
		if(ȫ��ģ��.containsKey(URI) && Ŀ���ļ� != ��ǰ�ļ�) {
			return;
		}
		�����б�.addAll(�����б�);
		�����б�.addAll(�����б�);
		for(File file : �����б�) {
			�ݹ�����ļ������ϵ(file, �ļ��б�);
			//������ȫ��ģ�飬��������ȫ��ģ��ᱻ����
			/*String s = file.getAbsolutePath();
			s = ģ��ID.get(s);
			if(s != null && ȫ��ģ��.containsKey(s))
				continue;*/
			�ļ��б�.add(file);
		}
	}
	private String ��ȡ�ļ�����(File Ŀ���ļ�) {
		BufferedReader br = null;
		StringBuilder sb = new StringBuilder();
		String s = null;
		try {
			br = new BufferedReader(new FileReader(Ŀ���ļ�));
			while((s = br.readLine()) != null) {
				sb.append(s);
				sb.append("\n");
			}
			br.close();
		} catch(IOException e) {
			e.printStackTrace();
		} finally {
			if(br != null) {
				try {
					br.close();
				} catch(IOException e) {
					//
				}
			}
		}
		return sb.toString();
	}
	private String ��ȡ�ļ�ע�Ϳ�ͷ(String s) {
		if(s.startsWith("/*")) {
			int i = s.indexOf("*/");
			if(i == -1)
				return "";
			return s.substring(0, i + 2);
		}
		return "";
	}
	private LinkedHashSet<File> ��ȡע�͵����ļ��б�(File Ŀ���ļ�, String ע��) {
		LinkedHashSet<File> �ļ��б� = new LinkedHashSet<File>();
		Pattern p = Pattern.compile("\\@import\\s+(.+?\\.js)");
		Matcher m = p.matcher(ע��);
		while(m.find()) {
			String s = m.group(1);
			File f = null;
			//ȫ������Ը�·��
			/*if(s.startsWith("/"))
				f = new File(��·�� + s);
			else
				f = new File(Ŀ���ļ�.getParent() + File.separator + s);*/
			if(s.startsWith("/"))
				s = s.substring(1);
			f = new File(��·�� + s);
			�ļ��б�.add(f);
		}
		return �ļ��б�;
	}
	private String ����ע�Ϳ�ͷ(String ע��) {
		return ע��.replaceAll("\n\\s*\\*\\s*\\@import[^\n]+", "")
				.replaceAll("\n\\s*\\*\\s*\\@![^\n]+", "");
	}
	private void ���(LinkedHashSet<File> �ļ��б�) {
		StringBuilder sb = new StringBuilder();
		System.out.println("---input:");
		String s = null;
		int i = 0;
		for(File f : �ļ��б�) {
			System.out.println(f.getAbsolutePath());
			if(i++ == 0) {
				д��ͷע��();
				sb.append(�ļ�ע��.get(��ǰ�ļ�));
				sb.append("\n");
			}
			if(i == �ļ��б�.size())
				sb.append(�ļ�ע��.get(f));
			else
				sb.append(����svn(�ļ�ע��.get(f)));
			sb.append("\n");
			String result = �ļ�����.get(f);
			if(�Ƿ�ģ��(result)) {
				sb.append("define.url('");
				String path = ��ȡģ��URI(f);
				sb.append(path);
				sb.append("');\n");
			}
			sb.append(result);
			sb.append("\n");
		}
		String output = ��ǰ�ļ�.getName();
		String compress = output;
		if(output.endsWith("_src.js")) {
			compress = output.substring(0, output.length() - 7) + ".js";
			output = output.substring(0, output.length() - 7) + "_combo.js";
		}
		else {
			System.out.println("---overwriter:");
			System.out.println(��ǰ�ļ�.getAbsolutePath());
			return;
		}
		compress = ��ǰ�ļ�.getParent() + File.separatorChar + compress;
		output = ��ǰ�ļ�.getParent() + File.separatorChar + output;
		System.out.println("---output:");
		s = sb.toString().trim();
		BufferedWriter bw = null;
		try {
			bw = new BufferedWriter(new FileWriter(output));
			bw.write(s);
			bw.close();
		} catch(IOException e) {
			e.printStackTrace();
		} finally {
			if(bw != null) {
				try {
					bw.close();
				} catch(IOException e) {
					//
				}
			}
		}
		System.out.println(output);
		System.out.println("---compress:");
		System.out.println(compress);
		s = CustomCompiler.compiler(output);
		try {
			bw = new BufferedWriter(new FileWriter(compress));
			bw.write(�ļ�ע��.get(��ǰ�ļ�));
			bw.write("\n");
			bw.write(s);
			bw.close();
		} catch(IOException e) {
			e.printStackTrace();
		} finally {
			if(bw != null) {
				try {
					bw.close();
				} catch(IOException e) {
					//
				}
			}
		}
	}
	private LinkedHashSet<File> ��ȡ�����ļ��б�(File Ŀ���ļ�, String ����) {
		LinkedHashSet<File> �б� = new LinkedHashSet<File>();
		String s = null;
		File f = null;
		if(!�Ƿ�ģ��(����))
			return �б�;
		//��ʾ����������
		Pattern p = Pattern.compile("\\bdefine\\s*\\(.*?\\[(.*?)\\]");
		Matcher m = p.matcher(����);
		if(m.find()) {
			s = m.group(1);
			p = Pattern.compile("(['\"])(.+?)\\1");
			m = p.matcher(s);
			while(m.find()) {
				s = m.group(2);
				f = ��ȡ�����ļ�(Ŀ���ļ�, s);
				if(f != null)
					�б�.add(f);
			}
		}
		//��ʽrequire������require("module")
		p = Pattern.compile("(?:^|[^.])\\s*\\brequire\\s*\\(\\s*([\"'])([^\"'\\s\\)]+)\\1\\s*\\)\\s*[^,]");
		m = p.matcher(����);
		while(m.find()) {
			s = m.group(2);
			f = ��ȡ�����ļ�(Ŀ���ļ�, s);
			if(f != null)
				�б�.add(f);
		}
		return �б�;
	}
	private File ��ȡ�����ļ�(File Ŀ���ļ�, String s) {
		File f = null;
		if(!s.endsWith(".js"))
			s += ".js";
		int i = s.indexOf('/');
		if(i == -1)
			i = 0;
		if(!ȫ��ģ��.containsKey(s.substring(i, s.length() - 3))) {
			if(s.startsWith("/"))
				s = ��·�� + s.substring(1);
			else
				s = Ŀ���ļ�.getParent() + File.separator + s;
			f = new File(s);
			if(!f.exists()) {
				System.err.println(f.getAbsolutePath() + "������");
				System.exit(0);
			}
		}
		return f;
	}
	private LinkedHashSet<File> ��ȡע�͹����ļ��б�(File Ŀ���ļ�, String ����) {
		LinkedHashSet<File> �б� = new LinkedHashSet<File>();
		Pattern p = Pattern.compile("\n\\s*//\\@import\n\\s*require\\s*\\(([^\\]{();]+)");
		Matcher m = p.matcher(����);
		while(m.find()) {
			String s = m.group(1);
			Pattern p2 = Pattern.compile("([\"'])([^\"'\\s\\)]+)\\1");
			Matcher m2 = p2.matcher(s);
			while(m2.find()) {
				File f = ��ȡ�����ļ�(Ŀ���ļ�, m2.group(2));
				if(f != null)
					�б�.add(f);
			}
		}
		return �б�;
	}
	private String ����svn(String s) {
		return s.replaceAll("\\$?(Id|Rev|LastChangedDate|Author|Date|URL)\\:?\\s*", "");
	}
	private String ��ȡģ��ID(String s) {
		if(�Ƿ�ģ��(s)) {
			Pattern p = Pattern.compile("\\bdefine\\s*\\((['\"])(.+?)\\1");
			Matcher m = p.matcher(s);
			if(m.find()) {
				return m.group(2);
			}
			return null;
		}
		return null;
	}
	private String ��ȡģ��URI(File f) {
		String path = f.getAbsolutePath().substring(��·��.length() - 1);
		path = path.replace('\\', '/')
				.replaceAll("\\w+/\\.\\./", "")
				.replace("./", "");
		if(path.endsWith(".js"))
			path = path.substring(0, path.length() - 3);
		if(path.endsWith("_src"))
			path = path.substring(0, path.length() - 4);
		else if(path.endsWith("_combo"))
			path = path.substring(0, path.length() - 6);
		return path;
	}
	private void д��ͷע��() {
		String s = �ļ�ע��.get(��ǰ�ļ�);
		if(s.length() == 0) {
			s = Ĭ��ͷע��;
		}
		else if(s.indexOf("@version") == -1) {
			s = s.replace("/**", "/**" + SVNͷ);
		}
		else
			return;
		�ļ�ע��.put(��ǰ�ļ�, s);
		//д�ص�ǰ�ļ�
		BufferedWriter bw = null;
		try {
			bw = new BufferedWriter(new FileWriter(��ǰ�ļ�));
			bw.write(s);
			bw.write("\n");
			bw.write(�ļ�����.get(��ǰ�ļ�));
			bw.close();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if(bw != null) {
				try {
					bw.close();
				} catch (IOException e) {
					//
				}
			}
		}
	}
	
	public static boolean �Ƿ�ģ��(String ����) {
		return ����.startsWith("define(");
	}
}
